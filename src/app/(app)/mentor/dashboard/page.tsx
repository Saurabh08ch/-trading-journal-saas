import { BookMarked, BrainCircuit, IndianRupee, Users2 } from "lucide-react";
import { redirect } from "next/navigation";

import { MentorStudentsOverview } from "@/components/mentor/mentor-students-overview";
import { StatCard } from "@/components/dashboard/stat-card";
import { getCurrentUser } from "@/lib/auth";
import { listStudentsForMentor } from "@/lib/mentor-service";
import { formatCurrency } from "@/lib/utils";

export default async function MentorDashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect("/login");
  }

  const students = await listStudentsForMentor(user.id);
  const totalTrades = students.reduce((sum, student) => sum + student.stats.totalTrades, 0);
  const totalProfit = students.reduce((sum, student) => sum + student.stats.totalProfit, 0);
  const weightedAverageRR =
    totalTrades === 0
      ? 0
      : students.reduce(
          (sum, student) => sum + student.stats.averageRR * student.stats.totalTrades,
          0,
        ) / totalTrades;

  return (
    <div className="space-y-8">
      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-end">
          <div>
            <span className="eyebrow">Mentor workspace</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Review student execution with structure.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Open each student journal, inspect trade-by-trade decisions, and leave precise
              feedback on entries, stop placement, and discipline.
            </p>
          </div>
          <div className="panel-strong p-5">
            <div className="text-sm text-slate-400">Coverage</div>
            <div className="mt-4 text-3xl font-semibold text-white">{students.length}</div>
            <div className="mt-2 text-sm text-slate-400">
              Linked student{students.length === 1 ? "" : "s"} ready for review.
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Students"
          value={String(students.length)}
          hint="Mentor relationships available"
          icon={Users2}
        />
        <StatCard
          label="Student Trades"
          value={String(totalTrades)}
          hint="Trades currently available to review"
          icon={BookMarked}
        />
        <StatCard
          label="Combined PnL"
          value={formatCurrency(totalProfit)}
          hint="Net realized performance across linked students"
          icon={IndianRupee}
          tone={totalProfit >= 0 ? "positive" : "negative"}
        />
        <StatCard
          label="Weighted Avg RR"
          value={weightedAverageRR.toFixed(2)}
          hint="Average student RR weighted by trade count"
          icon={BrainCircuit}
          tone={weightedAverageRR > 0 ? "positive" : "neutral"}
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Students ready for review</h2>
          <p className="mt-2 text-sm text-slate-400">
            Open a student to inspect analytics, recent trades, and ongoing mentor feedback.
          </p>
        </div>
        <MentorStudentsOverview students={students} />
      </section>
    </div>
  );
}
