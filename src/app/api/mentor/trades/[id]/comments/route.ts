import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { createTradeCommentForMentor, getTradeCommentsForMentor } from "@/lib/mentor-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MentorTradeCommentRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: MentorTradeCommentRouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const comments = await getTradeCommentsForMentor(session.user.id, id);

  if (!comments) {
    return NextResponse.json({ error: "Trade not found" }, { status: 404 });
  }

  return NextResponse.json({ comments });
}

export async function POST(request: Request, { params }: MentorTradeCommentRouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = (await request.json().catch(() => null)) as
      | { comment?: string }
      | null;

    const comment = await createTradeCommentForMentor(
      session.user.id,
      id,
      body?.comment ?? "",
    );

    if (!comment) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save mentor feedback right now.",
      },
      { status: 400 },
    );
  }
}
