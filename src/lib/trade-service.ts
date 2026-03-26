import { Prisma, Trade } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type SerializedTrade = Omit<
  Trade,
  | "date"
  | "createdAt"
  | "updatedAt"
  | "entryPrice"
  | "exitPrice"
  | "stopLoss"
  | "riskPercent"
  | "positionSize"
  | "pnl"
  | "rrRatio"
> & {
  date: string;
  createdAt: string;
  updatedAt: string;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  riskPercent: number;
  positionSize: number;
  pnl: number;
  rrRatio: number;
};

function decimalToNumber(value: Prisma.Decimal | number) {
  return Number(value);
}

export function serializeTrade(trade: Trade): SerializedTrade {
  return {
    ...trade,
    date: trade.date.toISOString(),
    createdAt: trade.createdAt.toISOString(),
    updatedAt: trade.updatedAt.toISOString(),
    entryPrice: decimalToNumber(trade.entryPrice),
    exitPrice: decimalToNumber(trade.exitPrice),
    stopLoss: decimalToNumber(trade.stopLoss),
    riskPercent: decimalToNumber(trade.riskPercent),
    positionSize: decimalToNumber(trade.positionSize),
    pnl: decimalToNumber(trade.pnl),
    rrRatio: decimalToNumber(trade.rrRatio),
  };
}

export async function listTradesForUser(userId: string) {
  const trades = await prisma.trade.findMany({
    where: { userId },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

  return trades.map(serializeTrade);
}

export async function getTradeForUser(userId: string, tradeId: string) {
  const trade = await prisma.trade.findFirst({
    where: {
      id: tradeId,
      userId,
    },
  });

  return trade ? serializeTrade(trade) : null;
}
