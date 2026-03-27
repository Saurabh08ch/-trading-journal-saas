import Link from "next/link";
import { ArrowLeft, MessageSquare, ShieldCheck, IndianRupee, BrainCircuit } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { DashboardOverviewChart } from "@/components/charts/dashboard-overview-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { MentorStudentTradeReviewList } from "@/components/mentor/mentor-student-trade-review-list";
import { getCurrentUser } from "@/lib/auth";
import { getMentorStudentReviewData } from "@/lib/mentor-service";
import { formatCurrency, formatPercent } from "@/lib/utils";

type MentorStudentPageProps = {
  params: {
    id: string;
  };
};

export default async function MentorStudentPage({ params }: MentorStudentPageProps) {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect("/login");
  }

  const reviewData = await getMentorStudentReviewData(user.id, params.id);

  if (!reviewData) {
    notFound();
  }

  const bestStrategy = reviewData.analytics.strategyPerformance[0];

  return (
    <div className="space-y-8">
      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-end">
          <div>
            <Link
              href="/mentor/dashboard"
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to mentor dashboard
            </Link>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-5xl">
              {reviewData.student.name ?? "Student Journal"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-300 md:text-base">
              {reviewData.student.email ?? "No email on file"}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Review performance stats, inspect the student&apos;s execution, and leave
              feedback directly on each trade.
            </p>
          </div>
          <div className="panel-strong p-5">
            <div className="text-sm text-slate-400">Feedback threads</div>
            <div className="mt-4 text-3xl font-semibold text-white">
              {reviewData.totalComments}
            </div>
            <div className="mt-2 text-sm text-slate-400">
              Mentor comment{reviewData.totalComments === 1 ? "" : "s"} across all trades.
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Profit"
          value={formatCurrency(reviewData.analytics.totals.totalProfit)}
          hint="Net realized PnL for this student"
          icon={IndianRupee}
          tone={reviewData.analytics.totals.totalProfit >= 0 ? "positive" : "negative"}
        />
        <StatCard
          label="Total Trades"
          value={String(reviewData.analytics.totals.totalTrades)}
          hint="Trades currently available for review"
          icon={MessageSquare}
        />
        <StatCard
          label="Win Rate"
          value={formatPercent(reviewData.analytics.totals.winRate)}
          hint="Percentage of trades closed green"
          icon={ShieldCheck}
          tone={reviewData.analytics.totals.winRate >= 50 ? "positive" : "neutral"}
        />
        <StatCard
          label="Average RR"
          value={reviewData.analytics.totals.averageRR.toFixed(2)}
          hint="Average reward-to-risk ratio"
          icon={BrainCircuit}
          tone={reviewData.analytics.totals.averageRR > 0 ? "positive" : "neutral"}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <DashboardOverviewChart data={reviewData.analytics.monthlyPnL} />

        <div className="space-y-6">
          <div className="panel p-6">
            <h3 className="text-lg font-semibold text-white">Best strategy</h3>
            <p className="mt-1 text-sm text-slate-400">
              Most profitable setup from the current student journal.
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
                    <div className="mt-1 text-white">
                      {formatPercent(bestStrategy.winRate)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-400">
                This student does not have enough trades to highlight a best strategy yet.
              </div>
            )}
          </div>

          <div className="panel p-6">
            <h3 className="text-lg font-semibold text-white">Mentor guidance</h3>
            <p className="mt-1 text-sm text-slate-400">
              Use the trade list below to leave actionable notes on timing, risk, and
              execution.
            </p>
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
              Best feedback tends to be specific: call out whether the entry was early, the
              stop was too tight, or the execution was clean and repeatable.
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Student trade review</h2>
          <p className="mt-2 text-sm text-slate-400">
            Each trade includes context, notes, screenshots, and a mentor comment thread.
          </p>
        </div>
        <MentorStudentTradeReviewList trades={reviewData.trades} />
      </section>
    </div>
  );
}
