import type { ComponentType } from "react";
import {
  AlertTriangle,
  BrainCircuit,
  CalendarDays,
  Clock3,
  Sparkles,
  TrendingDown,
} from "lucide-react";

import type { AITradeAnalysis } from "@/lib/ai-analysis-service";
import { formatCurrency } from "@/lib/utils";

type AIPerformanceInsightsProps = {
  analysis: AITradeAnalysis;
};

type InsightCardProps = {
  label: string;
  value: string;
  hint: string;
  icon: ComponentType<{ className?: string }>;
};

function InsightCard({ label, value, hint, icon: Icon }: InsightCardProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-slate-400">{label}</div>
          <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-accent">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-5 text-xs leading-6 text-slate-400">{hint}</div>
    </div>
  );
}

export function AIPerformanceInsights({ analysis }: AIPerformanceInsightsProps) {
  if (!analysis.bestStrategy) {
    return (
      <section className="panel p-6">
        <span className="eyebrow">AI Performance Insights</span>
        <h2 className="mt-4 text-2xl font-semibold text-white">Trade patterns need data first</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Add a few trades and this engine will surface your strongest strategy, weakest
          habit, best day, and emotion-led leaks automatically.
        </p>
      </section>
    );
  }

  return (
    <section className="panel overflow-hidden p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow">AI Performance Insights</span>
          <h2 className="mt-4 text-2xl font-semibold text-white md:text-3xl">
            Pattern recognition for your journal
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            SQL-driven trade analysis surfaces what is working, what is leaking edge, and
            where your behavior is hurting expectancy.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-400">
          Avg RR {analysis.avgRR.toFixed(2)}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InsightCard
          label="Best Strategy"
          value={analysis.bestStrategy ?? "N/A"}
          hint="Highest net realized PnL by strategy."
          icon={Sparkles}
        />
        <InsightCard
          label="Worst Habit"
          value={analysis.mostCommonMistake ?? "N/A"}
          hint="Inferred from the lowest-performing emotion tag."
          icon={AlertTriangle}
        />
        <InsightCard
          label="Best Trading Hour"
          value={analysis.bestHour ?? "N/A"}
          hint="Best-performing journal entry hour."
          icon={Clock3}
        />
        <InsightCard
          label="Emotion Loss"
          value={formatCurrency(analysis.emotionLoss)}
          hint={`Largest cumulative loss linked to ${analysis.worstEmotion ?? "emotion tags"}.`}
          icon={TrendingDown}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <BrainCircuit className="h-4 w-4 text-accent" />
            Insight summary
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Worst Strategy", analysis.worstStrategy ?? "N/A"],
              ["Best Trading Day", analysis.bestDay ?? "N/A"],
              ["Weakest Day", analysis.worstDay ?? "N/A"],
              ["Worst Emotion", analysis.worstEmotion ?? "N/A"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</div>
                <div className="mt-2 text-lg font-semibold text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <CalendarDays className="h-4 w-4 text-accent" />
            Read this carefully
          </div>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
            <p>
              Best and worst day rankings are grouped from your trade dates and net realized
              PnL.
            </p>
            <p>
              Best trading hour currently uses the trade record&apos;s `createdAt` timestamp,
              because the journal stores trade date but not execution time yet.
            </p>
            <p>
              Worst habit is inferred from the lowest-performing emotion tag until an explicit
              mistake field exists.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
