import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { buildAnalyticsSnapshot, roundTo } from "@/lib/trade-math";
import { serializeTrade, type SerializedTrade } from "@/lib/trade-service";

type StudentStatsRow = {
  studentId: string;
  totalTrades: number;
  totalProfit: number;
  winRate: number;
  averageRR: number;
  lastTradeDate: Date | string | null;
};

type TradeCommentWithMentor = Prisma.TradeCommentGetPayload<{
  include: {
    mentor: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
      };
    };
  };
}>;

type TradeWithComments = Prisma.TradeGetPayload<{
  include: {
    comments: {
      include: {
        mentor: {
          select: {
            id: true;
            name: true;
            email: true;
            image: true;
          };
        };
      };
      orderBy: {
        createdAt: "desc";
      };
    };
  };
}>;

export type SerializedTradeComment = {
  id: string;
  tradeId: string;
  mentorId: string;
  comment: string;
  createdAt: string;
  mentor: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

export type MentorStudentSummary = {
  student: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  stats: {
    totalTrades: number;
    totalProfit: number;
    winRate: number;
    averageRR: number;
    lastTradeDate: string | null;
  };
};

export type MentorStudentReviewTrade = SerializedTrade & {
  comments: SerializedTradeComment[];
};

export type MentorStudentReviewData = {
  student: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  analytics: ReturnType<typeof buildAnalyticsSnapshot>;
  totalComments: number;
  trades: MentorStudentReviewTrade[];
};

function toNumber(value: Prisma.Decimal | number | string | bigint | null | undefined) {
  if (value == null) {
    return 0;
  }

  return Number(value);
}

function serializeOptionalDate(value: Date | string | null) {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString();
}

function serializeTradeComment(comment: TradeCommentWithMentor): SerializedTradeComment {
  return {
    id: comment.id,
    tradeId: comment.tradeId,
    mentorId: comment.mentorId,
    comment: comment.comment,
    createdAt: comment.createdAt.toISOString(),
    mentor: {
      id: comment.mentor.id,
      name: comment.mentor.name,
      email: comment.mentor.email,
      image: comment.mentor.image,
    },
  };
}

function serializeTradeWithComments(trade: TradeWithComments): MentorStudentReviewTrade {
  return {
    ...serializeTrade(trade),
    comments: trade.comments.map(serializeTradeComment),
  };
}

export async function hasMentorStudents(mentorId: string) {
  const count = await prisma.mentorStudent.count({
    where: {
      mentorId,
    },
  });

  return count > 0;
}

export async function listStudentsForMentor(mentorId: string): Promise<MentorStudentSummary[]> {
  const [relations, statsRows] = await prisma.$transaction([
    prisma.mentorStudent.findMany({
      where: {
        mentorId,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    }),
    prisma.$queryRaw<StudentStatsRow[]>(Prisma.sql`
      SELECT
        ms."student_id" AS "studentId",
        COUNT(t."id")::int AS "totalTrades",
        COALESCE(SUM(t."pnl"), 0)::double precision AS "totalProfit",
        COALESCE(
          AVG(CASE WHEN t."outcome" = 'WIN' THEN 100 ELSE 0 END),
          0
        )::double precision AS "winRate",
        COALESCE(AVG(t."rr_ratio"), 0)::double precision AS "averageRR",
        MAX(t."date") AS "lastTradeDate"
      FROM "mentor_students" ms
      LEFT JOIN "trades" t ON t."user_id" = ms."student_id"
      WHERE ms."mentor_id" = ${mentorId}
      GROUP BY ms."student_id"
    `),
  ]);

  const statsMap = new Map(
    statsRows.map((row) => [
      row.studentId,
      {
        totalTrades: toNumber(row.totalTrades),
        totalProfit: roundTo(toNumber(row.totalProfit), 2),
        winRate: roundTo(toNumber(row.winRate), 1),
        averageRR: roundTo(toNumber(row.averageRR), 2),
        lastTradeDate: serializeOptionalDate(row.lastTradeDate),
      },
    ]),
  );

  return relations
    .map((relation) => ({
      student: relation.student,
      stats:
        statsMap.get(relation.studentId) ?? {
          totalTrades: 0,
          totalProfit: 0,
          winRate: 0,
          averageRR: 0,
          lastTradeDate: null,
        },
    }))
    .sort((left, right) =>
      (left.student.name ?? left.student.email ?? left.student.id).localeCompare(
        right.student.name ?? right.student.email ?? right.student.id,
      ),
    );
}

export async function getMentorStudentReviewData(
  mentorId: string,
  studentId: string,
): Promise<MentorStudentReviewData | null> {
  const relation = await prisma.mentorStudent.findFirst({
    where: {
      mentorId,
      studentId,
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  if (!relation) {
    return null;
  }

  const trades = await prisma.trade.findMany({
    where: {
      userId: studentId,
    },
    include: {
      comments: {
        include: {
          mentor: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

  const serializedTrades = trades.map(serializeTradeWithComments);

  return {
    student: relation.student,
    analytics: buildAnalyticsSnapshot(serializedTrades),
    totalComments: serializedTrades.reduce((sum, trade) => sum + trade.comments.length, 0),
    trades: serializedTrades,
  };
}

async function getAuthorizedTradeForMentor(mentorId: string, tradeId: string) {
  return prisma.trade.findFirst({
    where: {
      id: tradeId,
      user: {
        studentMentors: {
          some: {
            mentorId,
          },
        },
      },
    },
    select: {
      id: true,
    },
  });
}

export async function getTradeCommentsForMentor(
  mentorId: string,
  tradeId: string,
): Promise<SerializedTradeComment[] | null> {
  const trade = await getAuthorizedTradeForMentor(mentorId, tradeId);

  if (!trade) {
    return null;
  }

  const comments = await prisma.tradeComment.findMany({
    where: {
      tradeId,
    },
    include: {
      mentor: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments.map(serializeTradeComment);
}

export async function createTradeCommentForMentor(
  mentorId: string,
  tradeId: string,
  comment: string,
): Promise<SerializedTradeComment | null> {
  const normalizedComment = comment.trim();

  if (!normalizedComment) {
    throw new Error("Comment is required.");
  }

  const trade = await getAuthorizedTradeForMentor(mentorId, tradeId);

  if (!trade) {
    return null;
  }

  const createdComment = await prisma.tradeComment.create({
    data: {
      tradeId,
      mentorId,
      comment: normalizedComment,
    },
    include: {
      mentor: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return serializeTradeComment(createdComment);
}
