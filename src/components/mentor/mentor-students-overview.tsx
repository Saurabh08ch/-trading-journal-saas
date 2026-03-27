import Link from "next/link";
import { ArrowRight, MessageSquare, TrendingUp, Users2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MentorStudentSummary } from "@/lib/mentor-service";
import { formatCurrency, formatPercent } from "@/lib/utils";

type MentorStudentsOverviewProps = {
  students: MentorStudentSummary[];
};

export function MentorStudentsOverview({ students }: MentorStudentsOverviewProps) {
  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No students linked yet</CardTitle>
          <CardDescription>
            Add mentor-student links in the database and your review queue will appear here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {students.map(({ student, stats }) => (
        <Card key={student.id}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>{student.name ?? "Unnamed student"}</CardTitle>
                <CardDescription className="mt-2">
                  {student.email ?? "No email available"}
                </CardDescription>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-accent">
                <Users2 className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Total Trades
                </div>
                <div className="mt-2 text-xl font-semibold text-white">{stats.totalTrades}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Win Rate
                </div>
                <div className="mt-2 text-xl font-semibold text-white">
                  {formatPercent(stats.winRate)}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Net PnL
                </div>
                <div
                  className={`mt-2 text-xl font-semibold ${
                    stats.totalProfit >= 0 ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {formatCurrency(stats.totalProfit)}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Avg RR
                </div>
                <div className="mt-2 text-xl font-semibold text-white">
                  {stats.averageRR.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-400">
                Last trade:{" "}
                <span className="text-slate-200">
                  {stats.lastTradeDate
                    ? new Intl.DateTimeFormat("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(stats.lastTradeDate))
                    : "No trades yet"}
                </span>
              </div>
              <Link
                href={`/mentor/student/${student.id}`}
                className="secondary-button w-full justify-between sm:w-auto"
              >
                Review student
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
