import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: "neutral" | "positive" | "negative";
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.16em] uppercase",
        tone === "neutral" && "border-white/10 bg-white/5 text-slate-200",
        tone === "positive" && "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
        tone === "negative" && "border-rose-400/20 bg-rose-400/10 text-rose-200",
        className,
      )}
      {...props}
    />
  );
}
