import Link from "next/link";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";

import { TradeCommentPanel } from "@/components/mentor/trade-comment-panel";
import { EMOTION_OPTIONS, INSTRUMENT_OPTIONS, OUTCOME_LABELS, TRADE_TYPE_LABELS } from "@/lib/constants";
import type { MentorStudentReviewTrade } from "@/lib/mentor-service";
import { formatCurrency, formatDecimal } from "@/lib/utils";

const instrumentLabelMap = Object.fromEntries(
  INSTRUMENT_OPTIONS.map((option) => [option.value, option.label]),
);

const emotionLabelMap = Object.fromEntries(
  EMOTION_OPTIONS.map((option) => [option.value, option.label]),
);

type MentorStudentTradeReviewListProps = {
  trades: MentorStudentReviewTrade[];
};

export function MentorStudentTradeReviewList({
  trades,
}: MentorStudentTradeReviewListProps) {
  if (trades.length === 0) {
    return (
      <div className="panel p-8 text-center">
        <h3 className="text-xl font-semibold text-white">No student trades yet</h3>
        <p className="mt-3 text-sm text-slate-400">
          Once this student starts journaling, you can review setups and leave feedback here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {trades.map((trade) => (
        <div key={trade.id} className="panel overflow-hidden">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {format(new Date(trade.date), "dd MMM yyyy")}
                </div>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {instrumentLabelMap[trade.instrument] ?? trade.instrument} | {trade.strategy}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {TRADE_TYPE_LABELS[trade.tradeType ?? "BUY"] ?? trade.tradeType} |{" "}
                  {OUTCOME_LABELS[trade.outcome]}
                </p>
              </div>
              <div
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  trade.pnl >= 0
                    ? "badge-positive"
                    : "badge-negative"
                }`}
              >
                {formatCurrency(trade.pnl)}
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Entry", formatDecimal(trade.entryPrice)],
                  ["Exit", formatDecimal(trade.exitPrice)],
                  ["Stop Loss", formatDecimal(trade.stopLoss)],
                  ["RR", formatDecimal(trade.rrRatio)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      {label}
                    </div>
                    <div className="mt-2 text-lg font-semibold text-white">{value}</div>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Emotion
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    {emotionLabelMap[trade.emotion] ?? trade.emotion}
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Position Size
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    {formatDecimal(trade.positionSize)}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Notes</div>
                <div className="mt-3 text-sm leading-7 text-slate-300">
                  {trade.notes?.trim() ? trade.notes : "No notes added by the student."}
                </div>
                {trade.screenshotUrl ? (
                  <Link
                    href={trade.screenshotUrl}
                    className="mt-4 inline-flex items-center gap-2 text-sm text-accent"
                    target="_blank"
                  >
                    Open screenshot
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </div>

            <TradeCommentPanel tradeId={trade.id} comments={trade.comments} />
          </div>
        </div>
      ))}
    </div>
  );
}
