import Link from "next/link";
import { BrainCircuit, CandlestickChart, IndianRupee, Layers3 } from "lucide-react";
import { redirect } from "next/navigation";

import { AnalyticsCharts } from "@/components/charts/analytics-charts";
import { StatCard } from "@/components/dashboard/stat-card";
import { getCurrentUser } from "@/lib/auth";
import { buildAnalyticsSnapshot } from "@/lib/trade-math";
import { listTradesForUser } from "@/lib/trade-service";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect("/login");
  }

  const trades = await listTradesForUser(user.id);
  const analytics = buildAnalyticsSnapshot(trades);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow">Analytics</span>
          <h1 className="mt-4 page-title">Your trading edge, visualized</h1>
          <p className="mt-4 page-copy">
            Measure monthly performance, strategy-level execution, and the emotional patterns
            that influence live results.
          </p>
        </div>
        <Link href="/trades/new" className="primary-button">
          Add another trade
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Profit"
          value={formatCurrency(analytics.totals.totalProfit)}
          hint="Across the full journal history"
          icon={IndianRupee}
          tone={analytics.totals.totalProfit >= 0 ? "positive" : "negative"}
        />
        <StatCard
          label="Average PnL"
          value={formatCurrency(analytics.totals.averagePnL)}
          hint="Average realized PnL per trade"
          icon={CandlestickChart}
          tone={analytics.totals.averagePnL >= 0 ? "positive" : "negative"}
        />
        <StatCard
          label="Win Rate"
          value={formatPercent(analytics.totals.winRate)}
          hint="Win percentage from logged trades"
          icon={Layers3}
          tone={analytics.totals.winRate >= 50 ? "positive" : "neutral"}
        />
        <StatCard
          label="Average RR"
          value={analytics.totals.averageRR.toFixed(2)}
          hint="Average reward to risk ratio"
          icon={BrainCircuit}
          tone={analytics.totals.averageRR > 0 ? "positive" : "neutral"}
        />
      </section>

      {trades.length === 0 ? (
        <div className="panel p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">No analytics yet</h2>
          <p className="mt-3 text-sm text-slate-400">
            Add your first trade to generate strategy, monthly, and emotional analytics.
          </p>
          <Link href="/trades/new" className="primary-button mt-6">
            Add your first trade
          </Link>
        </div>
      ) : (
        <AnalyticsCharts
          monthlyPnL={analytics.monthlyPnL}
          strategyPerformance={analytics.strategyPerformance}
          emotionBreakdown={analytics.emotionBreakdown}
          winLossBreakdown={analytics.winLossBreakdown}
        />
      )}
    </div>
  );
}
