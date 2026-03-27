import Link from "next/link";
import { ArrowUpRight, BarChart3, CandlestickChart, Link2, ShieldCheck } from "lucide-react";

import { ReportEquityCurveChart } from "@/components/reports/report-equity-curve-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PublicReportAnalytics } from "@/lib/public-report-service";
import { formatCurrency, formatPercent } from "@/lib/utils";

type PublicReportViewProps = {
  report: PublicReportAnalytics;
};

function getPnlTone(value: number) {
  if (value > 0) {
    return "positive";
  }

  if (value < 0) {
    return "negative";
  }

  return "neutral";
}

export function PublicReportView({ report }: PublicReportViewProps) {
  const pnlTone = getPnlTone(report.summary.monthlyPnL);

  return (
    <div className="space-y-8 py-8 md:py-12">
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/80 px-6 py-8 shadow-card backdrop-blur-xl md:px-10 md:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(84,210,179,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(241,185,91,0.12),transparent_32%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-end">
          <div>
            <Badge tone="neutral">Public Performance Report</Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-6xl">
              {report.trader.displayName}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Shared trading performance for {report.report.monthLabel}, including the
              realized equity curve and strategy-level outcomes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                Period: {report.report.monthLabel}
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                Generated {new Intl.DateTimeFormat("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(new Date(report.report.createdAt))}
              </div>
            </div>
          </div>

          <Card className="bg-white/[0.04]">
            <CardHeader className="pb-4">
              <CardDescription>Shared via TradePilot</CardDescription>
              <CardTitle className="text-3xl">
                {formatCurrency(report.summary.monthlyPnL)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-slate-300">
                Monthly realized PnL with {report.summary.totalTrades} closed trade
                {report.summary.totalTrades === 1 ? "" : "s"}.
              </div>
              <Link
                href="/"
                className="secondary-button w-full justify-between"
                target="_blank"
                rel="noreferrer"
              >
                Explore TradePilot
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/[0.04]">
          <CardHeader className="pb-3">
            <CardDescription>Monthly PnL</CardDescription>
            <CardTitle
              className={
                pnlTone === "positive"
                  ? "text-3xl text-emerald-300"
                  : pnlTone === "negative"
                    ? "text-3xl text-rose-300"
                    : "text-3xl text-white"
              }
            >
              {formatCurrency(report.summary.monthlyPnL)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-slate-400">
            Realized profit or loss for the full report month.
          </CardContent>
        </Card>

        <Card className="bg-white/[0.04]">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Win Rate
            </CardDescription>
            <CardTitle className="text-3xl">{formatPercent(report.summary.winRate)}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-slate-400">
            Percentage of trades that closed with positive realized PnL.
          </CardContent>
        </Card>

        <Card className="bg-white/[0.04]">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CandlestickChart className="h-4 w-4 text-accent" />
              Total Trades
            </CardDescription>
            <CardTitle className="text-3xl">{report.summary.totalTrades}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-slate-400">
            Closed trades captured in this public report.
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <ReportEquityCurveChart data={report.equityCurve} />

        <Card className="bg-white/[0.04]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-accent" />
              Report snapshot
            </CardTitle>
            <CardDescription>
              A quick view of how the month unfolded at a glance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-slate-400">Ending equity</div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {formatCurrency(report.equityCurve.at(-1)?.equity ?? 0)}
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-slate-400">Best strategy</div>
              <div className="mt-2 text-xl font-semibold text-white">
                {report.strategyPerformance[0]?.strategy ?? "No trades yet"}
              </div>
              {report.strategyPerformance[0] ? (
                <div className="mt-2 text-sm text-slate-400">
                  {formatCurrency(report.strategyPerformance[0].pnl)} realized PnL
                </div>
              ) : null}
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-slate-400">Trades in curve</div>
              <div className="mt-2 text-xl font-semibold text-white">
                {report.equityCurve.length}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Strategy performance
            </CardTitle>
            <CardDescription>
              Compare which setups created the strongest realized results during the report
              month.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {report.strategyPerformance.length === 0 ? (
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm text-slate-400">
                Strategy performance will appear once the report includes closed trades.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Strategy</TableHead>
                    <TableHead>PnL</TableHead>
                    <TableHead>Trades</TableHead>
                    <TableHead>Win Rate</TableHead>
                    <TableHead>Avg RR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.strategyPerformance.map((strategy) => (
                    <TableRow key={strategy.strategy}>
                      <TableCell className="font-medium text-white">
                        {strategy.strategy}
                      </TableCell>
                      <TableCell
                        className={
                          strategy.pnl >= 0 ? "text-emerald-300" : "text-rose-300"
                        }
                      >
                        {formatCurrency(strategy.pnl)}
                      </TableCell>
                      <TableCell>{strategy.trades}</TableCell>
                      <TableCell>{formatPercent(strategy.winRate)}</TableCell>
                      <TableCell>{strategy.averageRR.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
