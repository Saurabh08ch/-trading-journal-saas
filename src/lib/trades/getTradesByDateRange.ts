import { prisma } from "@/lib/prisma";
import { serializeTrade } from "@/lib/trade-service";

export async function getTradesByDateRange(userId: string, startDate: Date, endDate: Date) {
  const trades = await prisma.trade.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });

  return trades.map(serializeTrade);
}
