import { format } from "date-fns";

import { TradeTypeValue } from "@/lib/constants";

type TradeOutcomeValue = "WIN" | "LOSS" | "BREAKEVEN";

export type AnalyticsTrade = {
  id: string;
  date: string | Date;
  instrument: string;
  strategy: string;
  pnl: number;
  rrRatio: number;
  outcome: TradeOutcomeValue;
  emotion: string;
};

export type TradeComputationInput = {
  tradeType?: TradeTypeValue;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  positionSize: number;
};

export type AnalyticsSnapshot = {
  totals: {
    totalProfit: number;
    totalTrades: number;
    winRate: number;
    averageRR: number;
    averagePnL: number;
  };
  monthlyPnL: Array<{ month: string; pnl: number }>;
  strategyPerformance: Array<{
    strategy: string;
    pnl: number;
    trades: number;
    winRate: number;
    averageRR: number;
  }>;
  emotionBreakdown: Array<{ emotion: string; value: number }>;
  winLossBreakdown: Array<{ name: string; value: number }>;
};

export function roundTo(value: number, decimals = 2) {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}

export function calculateTradeMetrics({
  tradeType = "BUY",
  entryPrice,
  exitPrice,
  stopLoss,
  positionSize,
}: TradeComputationInput) {
  const priceMove =
    tradeType === "SELL" ? entryPrice - exitPrice : exitPrice - entryPrice;
  const pnl = roundTo(priceMove * positionSize, 2);
  const totalRisk = roundTo(Math.abs(entryPrice - stopLoss) * positionSize, 2);
  const rrRatio = totalRisk === 0 ? 0 : roundTo(pnl / totalRisk, 2);

  let outcome: TradeOutcomeValue = "BREAKEVEN";

  if (pnl > 0) {
    outcome = "WIN";
  } else if (pnl < 0) {
    outcome = "LOSS";
  }

  return {
    pnl,
    rrRatio,
    totalRisk,
    outcome,
  };
}

export function buildAnalyticsSnapshot(trades: AnalyticsTrade[]): AnalyticsSnapshot {
  const totalProfit = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalTrades = trades.length;
  const wins = trades.filter((trade) => trade.outcome === "WIN").length;
  const winRate = totalTrades === 0 ? 0 : (wins / totalTrades) * 100;
  const averageRR =
    totalTrades === 0
      ? 0
      : trades.reduce((sum, trade) => sum + trade.rrRatio, 0) / totalTrades;
  const averagePnL = totalTrades === 0 ? 0 : totalProfit / totalTrades;

  const monthlyMap = new Map<string, number>();
  const strategyMap = new Map<
    string,
    { pnl: number; trades: number; wins: number; rrTotal: number }
  >();
  const emotionMap = new Map<string, number>();
  const winLossBreakdown = [
    { name: "Wins", value: wins },
    { name: "Losses", value: trades.filter((trade) => trade.outcome === "LOSS").length },
    {
      name: "Breakeven",
      value: trades.filter((trade) => trade.outcome === "BREAKEVEN").length,
    },
  ];

  for (const trade of trades) {
    const monthKey = format(new Date(trade.date), "yyyy-MM");
    monthlyMap.set(monthKey, roundTo((monthlyMap.get(monthKey) ?? 0) + trade.pnl, 2));

    const strategyBucket = strategyMap.get(trade.strategy) ?? {
      pnl: 0,
      trades: 0,
      wins: 0,
      rrTotal: 0,
    };

    strategyBucket.pnl += trade.pnl;
    strategyBucket.trades += 1;
    strategyBucket.rrTotal += trade.rrRatio;
    strategyBucket.wins += trade.outcome === "WIN" ? 1 : 0;
    strategyMap.set(trade.strategy, strategyBucket);

    emotionMap.set(trade.emotion, (emotionMap.get(trade.emotion) ?? 0) + 1);
  }

  const monthlyPnL = Array.from(monthlyMap.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([month, pnl]) => ({
      month: format(new Date(`${month}-01T00:00:00.000Z`), "MMM yy"),
      pnl: roundTo(pnl, 2),
    }));

  const strategyPerformance = Array.from(strategyMap.entries())
    .map(([strategy, bucket]) => ({
      strategy,
      pnl: roundTo(bucket.pnl, 2),
      trades: bucket.trades,
      winRate: bucket.trades === 0 ? 0 : roundTo((bucket.wins / bucket.trades) * 100, 1),
      averageRR: bucket.trades === 0 ? 0 : roundTo(bucket.rrTotal / bucket.trades, 2),
    }))
    .sort((left, right) => right.pnl - left.pnl);

  const emotionBreakdown = Array.from(emotionMap.entries())
    .map(([emotion, value]) => ({ emotion, value }))
    .sort((left, right) => right.value - left.value);

  return {
    totals: {
      totalProfit: roundTo(totalProfit, 2),
      totalTrades,
      winRate: roundTo(winRate, 1),
      averageRR: roundTo(averageRR, 2),
      averagePnL: roundTo(averagePnL, 2),
    },
    monthlyPnL,
    strategyPerformance,
    emotionBreakdown,
    winLossBreakdown,
  };
}
