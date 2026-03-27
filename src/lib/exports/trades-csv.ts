import { SerializedTrade } from "@/lib/trade-service";

function escapeCsvValue(value: string | number | null | undefined) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function buildTradesCsv(trades: SerializedTrade[]) {
  const header = [
    "Date",
    "Instrument",
    "Trade Type",
    "Strategy",
    "Entry Price",
    "Exit Price",
    "Stop Loss",
    "Risk Percent",
    "Position Size",
    "PnL",
    "RR Ratio",
    "Outcome",
    "Emotion",
    "Notes",
    "Screenshot URL",
  ];

  const rows = trades.map((trade) =>
    [
      trade.date,
      trade.instrument,
      trade.tradeType ?? "BUY",
      trade.strategy,
      trade.entryPrice,
      trade.exitPrice,
      trade.stopLoss,
      trade.riskPercent,
      trade.positionSize,
      trade.pnl,
      trade.rrRatio,
      trade.outcome,
      trade.emotion,
      trade.notes,
      trade.screenshotUrl,
    ]
      .map((value) => escapeCsvValue(value))
      .join(","),
  );

  return [header.join(","), ...rows].join("\n");
}
