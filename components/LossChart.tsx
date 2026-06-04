'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const COLORS = {
  grid: "#e5e7eb",
  axis: "#6b7280",
  line: "#2563eb",
  tooltipBg: "#ffffff",
  tooltipBorder: "#e5e7eb",
}

interface Props {
  history: number[]
}

export default function LossChart({ history }: Props) {
  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Loss curve will appear during training
      </div>
    )
  }

  const data = history.map((loss, i) => ({ epoch: i + 1, loss }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
        <XAxis
          dataKey="epoch"
          tick={{ fontSize: 11 }}
          stroke={COLORS.axis}
          label={{ value: "Epoch", position: "insideBottomRight", offset: -4, fontSize: 11 }}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          stroke={COLORS.axis}
          width={60}
          tickFormatter={(v) => v.toExponential(1)}
        />
        <Tooltip
          contentStyle={{
            background: COLORS.tooltipBg,
            border: `1px solid ${COLORS.tooltipBorder}`,
            borderRadius: 4,
            fontSize: 12,
          }}
          formatter={(v) => [typeof v === "number" ? v.toExponential(4) : v, "Loss"]}
          labelFormatter={(l) => `Epoch ${l}`}
        />
        <Line
          dataKey="loss"
          stroke={COLORS.line}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
