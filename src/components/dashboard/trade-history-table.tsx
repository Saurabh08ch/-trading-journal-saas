import Link from "next/link";
import { format } from "date-fns";
import { ExternalLink, PencilLine } from "lucide-react";

import { DeleteTradeButton } from "@/components/dashboard/delete-trade-button";
import { EMOTION_OPTIONS, INSTRUMENT_OPTIONS, OUTCOME_LABELS } from "@/lib/constants";
import { SerializedTrade } from "@/lib/trade-service";
import { formatCurrency, formatDecimal } from "@/lib/utils";

const instrumentLabelMap = Object.fromEntries(
  INSTRUMENT_OPTIONS.map((option) => [option.value, option.label]),
);

const emotionLabelMap = Object.fromEntries(
  EMOTION_OPTIONS.map((option) => [option.value, option.label]),
);

type TradeHistoryTableProps = {
  trades: SerializedTrade[];
};

export function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
  if (trades.length === 0) {
    return (
      <div className="panel p-8 text-center">
        <h3 className="text-xl font-semibold text-white">No trades logged yet</h3>
        <p className="mt-3 text-sm text-slate-400">
          Add your first trade to unlock PnL tracking, strategy analytics, and emotional
          review.
        </p>
        <Link href="/trades/new" className="primary-button mt-6">
          Add your first trade
        </Link>
      </div>
    );
  }

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
        <div>
          <h3 className="text-lg font-semibold text-white">Trade history</h3>
          <p className="mt-1 text-sm text-slate-400">
            Review outcomes, notes, screenshots, and the emotions behind each trade.
          </p>
        </div>
        <Link href="/trades/new" className="secondary-button">
          Add trade
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.18em] text-slate-500">
            <tr>
              {[
                "Date",
                "Instrument",
                "Strategy",
                "Entry",
                "Exit",
                "PnL",
                "RR",
                "Emotion",
                "Notes",
                "Actions",
              ].map((column) => (
                <th key={column} className="px-6 py-4 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-t border-white/6 text-sm text-slate-200">
                <td className="whitespace-nowrap px-6 py-4">
                  {format(new Date(trade.date), "dd MMM yyyy")}
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {instrumentLabelMap[trade.instrument] ?? trade.instrument}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-medium text-white">{trade.strategy}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {OUTCOME_LABELS[trade.outcome]}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">{formatDecimal(trade.entryPrice)}</td>
                <td className="whitespace-nowrap px-6 py-4">{formatDecimal(trade.exitPrice)}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={trade.pnl >= 0 ? "text-emerald-300" : "text-rose-300"}>
                    {formatCurrency(trade.pnl)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">{formatDecimal(trade.rrRatio)}</td>
                <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                  {emotionLabelMap[trade.emotion] ?? trade.emotion}
                </td>
                <td className="max-w-xs px-6 py-4 text-slate-400">
                  <div className="line-clamp-2">
                    {trade.notes?.trim() ? trade.notes : "No notes added"}
                  </div>
                  {trade.screenshotUrl ? (
                    <Link
                      href={trade.screenshotUrl}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-accent"
                      target="_blank"
                    >
                      Screenshot
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  ) : null}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/trades/${trade.id}/edit`}
                      className="inline-flex items-center gap-1 text-sm text-slate-300 transition hover:text-white"
                    >
                      <PencilLine className="h-4 w-4" />
                      Edit
                    </Link>
                    <DeleteTradeButton tradeId={trade.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
