"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EMOTION_OPTIONS } from "@/lib/constants";
import { formatCurrency, formatPercent } from "@/lib/utils";

type AnalyticsChartsProps = {
  monthlyPnL: Array<{ month: string; pnl: number }>;
  strategyPerformance: Array<{
    strategy: string;
    pnl: number;
    trades: number;
    winRate: number;
    averageRR: number;
  }>;
  emotionBreakdown: Array<{ emotion: string; value: number }>;
  winLossBreakdown: Array<{ name: string; value: number }>;
};

const PIE_COLORS = ["#54d2b3", "#f1b95b", "#7dd3fc", "#fb7185", "#c084fc"];

const emotionLabelMap = Object.fromEntries(
  EMOTION_OPTIONS.map((option) => [option.value, option.label]),
);

export function AnalyticsCharts({
  monthlyPnL,
  strategyPerformance,
  emotionBreakdown,
  winLossBreakdown,
}: AnalyticsChartsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="panel min-h-[360px] p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Monthly performance</h3>
          <p className="mt-1 text-sm text-slate-400">
            See whether profits are compounding or being given back month to month.
          </p>
        </div>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyPnL}>
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
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.96)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "18px",
                }}
                formatter={(value: number) => [formatCurrency(value), "PnL"]}
              />
              <Bar dataKey="pnl" radius={[12, 12, 0, 0]} fill="#54d2b3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel min-h-[360px] p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Win rate split</h3>
          <p className="mt-1 text-sm text-slate-400">
            Separate clean execution from breakeven churn and losing clusters.
          </p>
        </div>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={winLossBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={6}
              >
                {winLossBreakdown.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${entry.value}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.96)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "18px",
                }}
                formatter={(value: number) => [`${value}`, "Trades"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {winLossBreakdown.map((entry, index) => (
            <div key={entry.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                />
                {entry.name}
              </div>
              <div className="mt-2 text-xl font-semibold text-white">{entry.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel min-h-[420px] p-6 xl:col-span-2">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Strategy performance</h3>
          <p className="mt-1 text-sm text-slate-400">
            Compare the setups that truly move the PnL curve against the ones that leak edge.
          </p>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={strategyPerformance.slice(0, 8)} layout="vertical" margin={{ left: 12 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <YAxis
                type="category"
                dataKey="strategy"
                tick={{ fill: "#e2e8f0", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={130}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.96)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "18px",
                }}
                formatter={(value: number, _name, item) => {
                  const payload = item.payload as (typeof strategyPerformance)[number];

                  return [
                    `${formatCurrency(value)} | ${formatPercent(payload.winRate)} win rate | ${payload.averageRR.toFixed(2)} avg RR`,
                    payload.strategy,
                  ];
                }}
              />
              <Bar dataKey="pnl" radius={[0, 12, 12, 0]} fill="#f1b95b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel min-h-[360px] p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Emotional patterns</h3>
          <p className="mt-1 text-sm text-slate-400">
            Tag the mental state behind each trade to identify repeat behavioral leaks.
          </p>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={emotionBreakdown}
                dataKey="value"
                nameKey="emotion"
                innerRadius={55}
                outerRadius={96}
                paddingAngle={4}
              >
                {emotionBreakdown.map((entry, index) => (
                  <Cell
                    key={`${entry.emotion}-${entry.value}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.96)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "18px",
                }}
                formatter={(value: number, _name, item) => {
                  const payload = item.payload as (typeof emotionBreakdown)[number];
                  return [value, emotionLabelMap[payload.emotion] ?? payload.emotion];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel min-h-[360px] p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Top emotional tags</h3>
          <p className="mt-1 text-sm text-slate-400">
            High-frequency emotions often explain why a strategy underperforms in live trading.
          </p>
        </div>
        <div className="space-y-3">
          {emotionBreakdown.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
              Emotional tracking data will appear here after you add trades.
            </div>
          ) : (
            emotionBreakdown.map((entry, index) => (
              <div
                key={entry.emotion}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className="text-sm text-white">
                    {emotionLabelMap[entry.emotion] ?? entry.emotion}
                  </span>
                </div>
                <span className="text-sm text-slate-300">{entry.value} trades</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
