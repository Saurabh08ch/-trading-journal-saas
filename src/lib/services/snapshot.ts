import { prisma } from "@/lib/prisma";
import { buildAnalyticsSnapshot } from "@/lib/trade-math";
import { getTradesByDateRange } from "@/lib/trades/getTradesByDateRange";

function getMonthDateRange(month: number, year: number) {
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12.");
  }

  const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  return { startDate, endDate };
}

export async function generateMonthlySnapshot(userId: string, month: number, year: number) {
  const { startDate, endDate } = getMonthDateRange(month, year);
  const trades = await getTradesByDateRange(userId, startDate, endDate);

  // Reuse the shared analytics math so saved monthly snapshots stay aligned with
  // the dashboard and analytics views that traders already see elsewhere in the app.
  const analytics = buildAnalyticsSnapshot(trades);

  return prisma.monthlySnapshot.upsert({
    where: {
      userId_month_year: {
        userId,
        month,
        year,
      },
    },
    update: {
      totalTrades: analytics.totals.totalTrades,
      winRate: analytics.totals.winRate,
      totalProfit: analytics.totals.totalProfit,
      avgRR: analytics.totals.averageRR,
    },
    create: {
      userId,
      month,
      year,
      totalTrades: analytics.totals.totalTrades,
      winRate: analytics.totals.winRate,
      totalProfit: analytics.totals.totalProfit,
      avgRR: analytics.totals.averageRR,
    },
  });
}
