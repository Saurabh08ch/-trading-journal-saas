import { Prisma } from "@prisma/client";

import { EMOTION_OPTIONS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { roundTo } from "@/lib/trade-math";

const emotionLabelMap = Object.fromEntries(
  EMOTION_OPTIONS.map((option) => [option.value, option.label]),
);

const dayLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const localizedTradeDateSql = Prisma.sql`("date" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')`;
const localizedCreatedAtSql =
  Prisma.sql`("created_at" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')`;

type StrategyAggregateRow = {
  strategy: string;
  tradeCount: number;
  totalPnl: number;
  avgRR: number;
  winRate: number;
};

type DayAggregateRow = {
  dayIndex: number;
  tradeCount: number;
  totalPnl: number;
  avgRR: number;
};

type HourAggregateRow = {
  hour: number;
  tradeCount: number;
  totalPnl: number;
};

type EmotionAggregateRow = {
  emotion: string;
  tradeCount: number;
  totalPnl: number;
  lossPnl: number;
  avgPnl: number;
  winRate: number;
};

type SummaryRow = {
  totalTrades: number;
  avgRR: number;
};

export type AITradeAnalysis = {
  bestStrategy: string | null;
  worstStrategy: string | null;
  bestDay: string | null;
  worstDay: string | null;
  bestHour: string | null;
  avgRR: number;
  worstEmotion: string | null;
  emotionLoss: number;
  mostCommonMistake: string | null;
  emotionPerformance: Array<{
    emotion: string;
    tradeCount: number;
    totalPnl: number;
    avgPnl: number;
    winRate: number;
    lossPnl: number;
  }>;
};

function formatHourLabel(hour: number) {
  const normalizedHour = Math.min(Math.max(Math.trunc(hour), 0), 23);
  return `${String(normalizedHour).padStart(2, "0")}:00`;
}

function getDayLabel(dayIndex: number) {
  return dayLabels[dayIndex] ?? null;
}

function toNumber(value: Prisma.Decimal | string | number | bigint | null | undefined) {
  if (value == null) {
    return 0;
  }

  return Number(value);
}

function getEmotionLabel(emotion: string | null | undefined) {
  if (!emotion) {
    return null;
  }

  return emotionLabelMap[emotion] ?? emotion;
}

export async function getAITradeAnalysis(userId: string): Promise<AITradeAnalysis> {
  const [summaryRows, strategyRows, dayRows, hourRows, emotionRows] = await prisma.$transaction([
    prisma.$queryRaw<SummaryRow[]>(Prisma.sql`
      SELECT
        COUNT(*)::int AS "totalTrades",
        COALESCE(AVG("rr_ratio"), 0)::double precision AS "avgRR"
      FROM "trades"
      WHERE "user_id" = ${userId}
    `),
    prisma.$queryRaw<StrategyAggregateRow[]>(Prisma.sql`
      SELECT
        "strategy" AS "strategy",
        COUNT(*)::int AS "tradeCount",
        COALESCE(SUM("pnl"), 0)::double precision AS "totalPnl",
        COALESCE(AVG("rr_ratio"), 0)::double precision AS "avgRR",
        COALESCE(
          AVG(CASE WHEN "outcome" = 'WIN' THEN 100 ELSE 0 END),
          0
        )::double precision AS "winRate"
      FROM "trades"
      WHERE "user_id" = ${userId}
      GROUP BY "strategy"
      ORDER BY SUM("pnl") DESC, COUNT(*) DESC, "strategy" ASC
    `),
    prisma.$queryRaw<DayAggregateRow[]>(Prisma.sql`
      SELECT
        EXTRACT(DOW FROM ${localizedTradeDateSql})::int AS "dayIndex",
        COUNT(*)::int AS "tradeCount",
        COALESCE(SUM("pnl"), 0)::double precision AS "totalPnl",
        COALESCE(AVG("rr_ratio"), 0)::double precision AS "avgRR"
      FROM "trades"
      WHERE "user_id" = ${userId}
      GROUP BY 1
      ORDER BY SUM("pnl") DESC, COUNT(*) DESC, 1 ASC
    `),
    prisma.$queryRaw<HourAggregateRow[]>(Prisma.sql`
      SELECT
        EXTRACT(HOUR FROM ${localizedCreatedAtSql})::int AS "hour",
        COUNT(*)::int AS "tradeCount",
        COALESCE(SUM("pnl"), 0)::double precision AS "totalPnl"
      FROM "trades"
      WHERE "user_id" = ${userId}
      GROUP BY 1
      ORDER BY SUM("pnl") DESC, COUNT(*) DESC, 1 ASC
    `),
    prisma.$queryRaw<EmotionAggregateRow[]>(Prisma.sql`
      SELECT
        "emotion" AS "emotion",
        COUNT(*)::int AS "tradeCount",
        COALESCE(SUM("pnl"), 0)::double precision AS "totalPnl",
        COALESCE(SUM(CASE WHEN "pnl" < 0 THEN "pnl" ELSE 0 END), 0)::double precision AS "lossPnl",
        COALESCE(AVG("pnl"), 0)::double precision AS "avgPnl",
        COALESCE(
          AVG(CASE WHEN "outcome" = 'WIN' THEN 100 ELSE 0 END),
          0
        )::double precision AS "winRate"
      FROM "trades"
      WHERE "user_id" = ${userId}
      GROUP BY "emotion"
      ORDER BY SUM("pnl") ASC, COUNT(*) DESC, "emotion" ASC
    `),
  ]);

  const summary = summaryRows[0];
  const totalTrades = toNumber(summary?.totalTrades);

  if (totalTrades === 0) {
    return {
      bestStrategy: null,
      worstStrategy: null,
      bestDay: null,
      worstDay: null,
      bestHour: null,
      avgRR: 0,
      worstEmotion: null,
      emotionLoss: 0,
      mostCommonMistake: null,
      emotionPerformance: [],
    };
  }

  const bestStrategy = strategyRows[0];
  const worstStrategy = strategyRows.at(-1);
  const bestDay = dayRows[0];
  const worstDay = dayRows.at(-1);
  const bestHour = hourRows[0];
  const worstEmotion = emotionRows[0];

  return {
    bestStrategy: bestStrategy?.strategy ?? null,
    worstStrategy: worstStrategy?.strategy ?? null,
    bestDay: bestDay ? getDayLabel(toNumber(bestDay.dayIndex)) : null,
    worstDay: worstDay ? getDayLabel(toNumber(worstDay.dayIndex)) : null,
    bestHour: bestHour ? formatHourLabel(toNumber(bestHour.hour)) : null,
    avgRR: roundTo(toNumber(summary?.avgRR), 2),
    worstEmotion: getEmotionLabel(worstEmotion?.emotion),
    emotionLoss: roundTo(Math.abs(toNumber(worstEmotion?.lossPnl)), 2),
    mostCommonMistake: getEmotionLabel(worstEmotion?.emotion),
    emotionPerformance: [...emotionRows]
      .sort((left, right) => toNumber(right.totalPnl) - toNumber(left.totalPnl))
      .map((row) => ({
        emotion: getEmotionLabel(row.emotion) ?? row.emotion,
        tradeCount: toNumber(row.tradeCount),
        totalPnl: roundTo(toNumber(row.totalPnl), 2),
        avgPnl: roundTo(toNumber(row.avgPnl), 2),
        winRate: roundTo(toNumber(row.winRate), 1),
        lossPnl: roundTo(Math.abs(toNumber(row.lossPnl)), 2),
      })),
  };
}
