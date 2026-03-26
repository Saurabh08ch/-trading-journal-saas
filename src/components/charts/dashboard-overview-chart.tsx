"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/utils";

type DashboardOverviewChartProps = {
  data: Array<{ month: string; pnl: number }>;
};

export function DashboardOverviewChart({ data }: DashboardOverviewChartProps) {
  if (data.length === 0) {
    return (
      <div className="panel flex min-h-[320px] items-center justify-center p-8 text-center text-sm text-slate-400">
        Monthly PnL will appear once trades are added.
      </div>
    );
  }

  return (
    <div className="panel min-h-[320px] p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Monthly PnL</h3>
        <p className="mt-1 text-sm text-slate-400">
          Spot momentum shifts and drawdown periods at a glance.
        </p>
      </div>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="monthlyPnl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#54d2b3" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#54d2b3" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              cursor={{ stroke: "rgba(255,255,255,0.12)", strokeDasharray: "4 4" }}
              contentStyle={{
                background: "rgba(15, 23, 42, 0.96)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "18px",
              }}
              formatter={(value: number) => [formatCurrency(value), "PnL"]}
            />
            <Area
              type="monotone"
              dataKey="pnl"
              stroke="#54d2b3"
              strokeWidth={2}
              fill="url(#monthlyPnl)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
