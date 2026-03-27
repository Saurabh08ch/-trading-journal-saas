import Link from "next/link";
import { Activity, ArrowRight, BrainCircuit, IndianRupee, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { DashboardOverviewChart } from "@/components/charts/dashboard-overview-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { TradeHistoryTable } from "@/components/dashboard/trade-history-table";
import { EMOTION_OPTIONS } from "@/lib/constants";
import { getCurrentUser } from "@/lib/auth";
import { buildAnalyticsSnapshot } from "@/lib/trade-math";
import { listTradesForUser } from "@/lib/trade-service";
import { formatCurrency, formatPercent } from "@/lib/utils";

const emotionLabelMap = Object.fromEntries(
  EMOTION_OPTIONS.map((option) => [option.value, option.label]),
);

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect("/login");
  }

  const trades = await listTradesForUser(user.id);
  const analytics = buildAnalyticsSnapshot(trades);
  const bestStrategy = analytics.strategyPerformance[0];
  const topEmotion = analytics.emotionBreakdown[0];
  const totalProfitTone =
    analytics.totals.totalProfit > 0
      ? "positive"
      : analytics.totals.totalProfit < 0
        ? "negative"
        : "neutral";

  return (
    <div className="space-y-8">
      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-end">
          <div>
            <span className="eyebrow">Private dashboard</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Welcome back, {user.name?.split(" ")[0] ?? "Trader"}.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Track every execution, review the emotions behind each trade, and turn your
              journal into a measurable edge.
            </p>
          </div>
          <div className="panel-strong p-5">
            <div className="text-sm text-slate-400">Quick actions</div>
            <div className="mt-5 space-y-3">
              <Link href="/trades/new" className="primary-button w-full justify-between">
                Add trade
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/analytics" className="secondary-button w-full justify-between">
                Open analytics
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Profit"
          value={formatCurrency(analytics.totals.totalProfit)}
          hint="Net realized PnL across all trades"
          icon={IndianRupee}
          tone={totalProfitTone}
        />
        <StatCard
          label="Total Trades"
          value={String(analytics.totals.totalTrades)}
          hint="All logged trades in your journal"
          icon={Activity}
        />
        <StatCard
          label="Win Rate"
          value={formatPercent(analytics.totals.winRate)}
          hint="Percentage of trades closed green"
          icon={ShieldCheck}
          tone={analytics.totals.winRate >= 50 ? "positive" : "neutral"}
        />
        <StatCard
          label="Average RR"
          value={analytics.totals.averageRR.toFixed(2)}
          hint="Average reward to risk per trade"
          icon={BrainCircuit}
          tone={analytics.totals.averageRR > 0 ? "positive" : "neutral"}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <DashboardOverviewChart data={analytics.monthlyPnL} />

        <div className="space-y-6">
          <div className="panel p-6">
            <h3 className="text-lg font-semibold text-white">Best strategy</h3>
            <p className="mt-1 text-sm text-slate-400">
              Your most profitable setup based on logged trades.
            </p>
            {bestStrategy ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm text-slate-400">Strategy</div>
                <div className="mt-2 text-2xl font-semibold text-white">{bestStrategy.strategy}</div>
                <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500">PnL</div>
                    <div className="mt-1 text-white">{formatCurrency(bestStrategy.pnl)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Win rate</div>
                    <div className="mt-1 text-white">{formatPercent(bestStrategy.winRate)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-400">
                Add trades to see which strategy actually moves your equity curve.
              </div>
            )}
          </div>

          <div className="panel p-6">
            <h3 className="text-lg font-semibold text-white">Dominant emotion</h3>
            <p className="mt-1 text-sm text-slate-400">
              The feeling you tagged most often in your journal.
            </p>
            {topEmotion ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm text-slate-400">Emotion</div>
                <div className="mt-2 text-2xl font-semibold text-white">
                  {emotionLabelMap[topEmotion.emotion] ?? topEmotion.emotion}
                </div>
                <div className="mt-5 text-sm text-slate-300">
                  Tagged on {topEmotion.value} trade{topEmotion.value === 1 ? "" : "s"}.
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-400">
                Emotion insights unlock after you start tagging trades.
              </div>
            )}
          </div>
        </div>
      </section>

      <TradeHistoryTable trades={trades.slice(0, 12)} />
    </div>
  );
}
