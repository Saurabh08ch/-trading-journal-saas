import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tone?: "neutral" | "positive" | "negative";
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
}: StatCardProps) {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl border",
            tone === "positive" && "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
            tone === "negative" && "border-rose-400/20 bg-rose-400/10 text-rose-300",
            tone === "neutral" && "border-white/10 bg-white/5 text-slate-200",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
        {tone === "positive" ? (
          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-300" />
        ) : tone === "negative" ? (
          <ArrowDownRight className="h-3.5 w-3.5 text-rose-300" />
        ) : (
          <div className="h-2 w-2 rounded-full bg-accent" />
        )}
        <span>{hint}</span>
      </div>
    </div>
  );
}
