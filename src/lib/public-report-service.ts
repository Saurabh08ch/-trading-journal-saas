import { format } from "date-fns";

import { prisma } from "@/lib/prisma";
import { buildAnalyticsSnapshot, roundTo } from "@/lib/trade-math";
import { getTradesByDateRange } from "@/lib/trades/getTradesByDateRange";

const REPORT_TIME_ZONE = "Asia/Kolkata";

function getMonthKeyParts(monthKey: string) {
  const [yearPart, monthPart] = monthKey.split("-");
  const year = Number(yearPart);
  const month = Number(monthPart);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error("Invalid report month.");
  }

  return { year, month };
}

function getMonthRangeFromKey(monthKey: string) {
  const { year, month } = getMonthKeyParts(monthKey);

  return {
    startDate: new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0)),
    endDate: new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)),
  };
}

export function getCurrentReportMonthKey(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: REPORT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;

  if (!year || !month) {
    throw new Error("Unable to determine the current report month.");
  }

  return `${year}-${month}`;
}

export function formatReportMonthLabel(monthKey: string) {
  const { year, month } = getMonthKeyParts(monthKey);

  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function buildEquityCurve(
  trades: Awaited<ReturnType<typeof getTradesByDateRange>>,
) {
  let cumulativePnL = 0;

  return [...trades]
    .sort(
      (left, right) =>
        new Date(left.date).getTime() - new Date(right.date).getTime() ||
        new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
    )
    .map((trade, index) => {
      cumulativePnL = roundTo(cumulativePnL + trade.pnl, 2);

      return {
        tradeNumber: index + 1,
        tradeId: trade.id,
        date: trade.date,
        dateLabel: format(new Date(trade.date), "dd MMM yyyy"),
        equity: cumulativePnL,
        pnl: trade.pnl,
        strategy: trade.strategy,
      };
    });
}

export type PublicReportAnalytics = {
  report: {
    id: string;
    month: string;
    monthLabel: string;
    createdAt: string;
    isPublic: boolean;
  };
  trader: {
    displayName: string;
  };
  summary: {
    monthlyPnL: number;
    totalTrades: number;
    winRate: number;
  };
  equityCurve: Array<{
    tradeNumber: number;
    tradeId: string;
    date: string;
    dateLabel: string;
    equity: number;
    pnl: number;
    strategy: string;
  }>;
  strategyPerformance: Array<{
    strategy: string;
    pnl: number;
    trades: number;
    winRate: number;
    averageRR: number;
  }>;
};

export async function createOrGetCurrentMonthPublicReport(userId: string) {
  const month = getCurrentReportMonthKey();
  const { startDate, endDate } = getMonthRangeFromKey(month);
  const trades = await getTradesByDateRange(userId, startDate, endDate);

  if (trades.length === 0) {
    throw new Error(
      `Add at least one trade in ${formatReportMonthLabel(month)} before generating a shareable report.`,
    );
  }

  const existingReport = await prisma.publicReport.findFirst({
    where: {
      userId,
      month,
      isPublic: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (existingReport) {
    return existingReport;
  }

  return prisma.publicReport.create({
    data: {
      userId,
      month,
      isPublic: true,
    },
  });
}

export async function getPublicReportAnalyticsById(
  reportId: string,
): Promise<PublicReportAnalytics | null> {
  const report = await prisma.publicReport.findUnique({
    where: {
      id: reportId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!report || !report.isPublic) {
    return null;
  }

  const { startDate, endDate } = getMonthRangeFromKey(report.month);
  const trades = await getTradesByDateRange(report.userId, startDate, endDate);
  const analytics = buildAnalyticsSnapshot(trades);
  const displayName = report.user.name?.trim() || "Anonymous Trader";

  return {
    report: {
      id: report.id,
      month: report.month,
      monthLabel: formatReportMonthLabel(report.month),
      createdAt: report.createdAt.toISOString(),
      isPublic: report.isPublic,
    },
    trader: {
      displayName,
    },
    summary: {
      monthlyPnL: analytics.totals.totalProfit,
      totalTrades: analytics.totals.totalTrades,
      winRate: analytics.totals.winRate,
    },
    equityCurve: buildEquityCurve(trades),
    strategyPerformance: analytics.strategyPerformance,
  };
}
