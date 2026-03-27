"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type ReportEquityCurveChartProps = {
  data: Array<{
    tradeNumber: number;
    tradeId: string;
    date: string;
    dateLabel: string;
    equity: number;
    pnl: number;
    strategy: string;
  }>;
};

export function ReportEquityCurveChart({ data }: ReportEquityCurveChartProps) {
  if (data.length === 0) {
    return (
      <Card className="min-h-[380px]">
        <CardHeader>
          <CardTitle>Equity curve</CardTitle>
          <CardDescription>
            This report does not have any closed trades in the selected month yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="min-h-[380px]">
      <CardHeader>
        <CardTitle>Equity curve</CardTitle>
        <CardDescription>
          Follow how realized PnL compounded trade by trade through the month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 8, right: 8 }}>
              <defs>
                <linearGradient id="reportEquity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#54d2b3" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#54d2b3" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.16)" />
              <XAxis
                dataKey="tradeNumber"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                label={{
                  value: "Trade Number",
                  position: "insideBottom",
                  offset: -6,
                  fill: "#64748b",
                  fontSize: 12,
                }}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
                width={92}
              />
              <Tooltip
                cursor={{ stroke: "rgba(255,255,255,0.12)", strokeDasharray: "4 4" }}
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.96)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "18px",
                }}
                formatter={(value: number, name, item) => {
                  const payload = item.payload as ReportEquityCurveChartProps["data"][number];

                  if (name === "equity") {
                    return [formatCurrency(value), `${payload.dateLabel} equity`];
                  }

                  return [formatCurrency(value), "PnL"];
                }}
                labelFormatter={(_value, payload) => {
                  const point = payload?.[0]?.payload as
                    | ReportEquityCurveChartProps["data"][number]
                    | undefined;

                  return point
                    ? `${point.dateLabel} | ${point.strategy}`
                    : "Trade snapshot";
                }}
              />
              <Area
                type="monotone"
                dataKey="equity"
                stroke="#54d2b3"
                strokeWidth={2.5}
                fill="url(#reportEquity)"
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
