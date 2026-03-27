import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Download,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";
import { redirect } from "next/navigation";

import { StatCard } from "@/components/dashboard/stat-card";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateMonthlySnapshot } from "@/lib/services/snapshot";
import { formatCurrency, formatPercent } from "@/lib/utils";

function formatSnapshotLabel(month: number, year: number) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

function getProfitTone(totalProfit: number): "neutral" | "positive" | "negative" {
  if (totalProfit > 0) {
    return "positive";
  }

  if (totalProfit < 0) {
    return "negative";
  }

  return "neutral";
}

export default async function ReportsPage() {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect("/login");
  }

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const currentSnapshot = await generateMonthlySnapshot(user.id, currentMonth, currentYear);
  const recentSnapshots = await prisma.monthlySnapshot.findMany({
    where: {
      userId: user.id,
    },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    take: 6,
  });

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow">Reports</span>
          <h1 className="mt-4 page-title">Monthly performance snapshots</h1>
          <p className="mt-4 page-copy">
            Persisted monthly stats give you a lightweight reporting layer that can grow into
            exports, billing, and deeper analytics over time.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/analytics" className="secondary-button">
            Open analytics
          </Link>
          <Link href="/api/export/csv" className="primary-button gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Link>
        </div>
      </section>

      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_240px] xl:items-end">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Current snapshot</div>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {formatSnapshotLabel(currentSnapshot.month, currentSnapshot.year)}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              The latest snapshot is regenerated from trades already stored in your journal, so
              this view stays aligned with your dashboard and analytics pages.
            </p>
          </div>
          <div className="panel-strong p-5">
            <div className="text-sm text-slate-400">Quick actions</div>
            <div className="mt-5 space-y-3">
              <Link href="/trades/new" className="primary-button w-full justify-between">
                Add trade
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/api/export/csv" className="secondary-button w-full justify-between">
                Download CSV
                <Download className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Trades"
          value={String(currentSnapshot.totalTrades)}
          hint="Closed trades captured this month"
          icon={Activity}
        />
        <StatCard
          label="Win Rate"
          value={formatPercent(currentSnapshot.winRate)}
          hint="Percentage of trades closed green"
          icon={ShieldCheck}
          tone={currentSnapshot.winRate >= 50 ? "positive" : "neutral"}
        />
        <StatCard
          label="Total Profit"
          value={formatCurrency(currentSnapshot.totalProfit)}
          hint="Net realized PnL for the month"
          icon={IndianRupee}
          tone={getProfitTone(currentSnapshot.totalProfit)}
        />
        <StatCard
          label="Average RR"
          value={currentSnapshot.avgRR.toFixed(2)}
          hint="Average reward-to-risk ratio"
          icon={BrainCircuit}
          tone={currentSnapshot.avgRR > 0 ? "positive" : "neutral"}
        />
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-white/10 px-6 py-5">
          <h3 className="text-lg font-semibold text-white">Recent monthly snapshots</h3>
          <p className="mt-1 text-sm text-slate-400">
            These saved aggregates can power future PDF reports, emailed summaries, and
            month-over-month comparisons.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                {["Month", "Trades", "Win Rate", "Total Profit", "Avg RR", "Created"].map(
                  (column) => (
                    <th key={column} className="px-6 py-4 font-medium">
                      {column}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {recentSnapshots.map((snapshot) => (
                <tr
                  key={snapshot.id}
                  className="border-t border-white/6 text-sm text-slate-200"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-white">
                    {formatSnapshotLabel(snapshot.month, snapshot.year)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{snapshot.totalTrades}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {formatPercent(snapshot.winRate)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={
                        snapshot.totalProfit >= 0 ? "text-emerald-300" : "text-rose-300"
                      }
                    >
                      {formatCurrency(snapshot.totalProfit)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{snapshot.avgRR.toFixed(2)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-400">
                    {new Intl.DateTimeFormat("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(snapshot.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
