'use client'

import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { DataPoint } from "@/lib/types"

const COLORS = {
  grid: "#e5e7eb",
  axis: "#6b7280",
  dots: "#2563eb",
  curve: "#dc2626",
  tooltipBg: "#ffffff",
  tooltipBorder: "#e5e7eb",
}

interface Props {
  data: DataPoint[]
  curve: DataPoint[]
}

export default function FitChart({ data, curve }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Load a dataset to see it here
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
        <XAxis
          dataKey="x"
          type="number"
          name="x"
          domain={["auto", "auto"]}
          tick={{ fontSize: 11 }}
          stroke={COLORS.axis}
        />
        <YAxis
          dataKey="y"
          type="number"
          name="y"
          domain={["auto", "auto"]}
          tick={{ fontSize: 11 }}
          stroke={COLORS.axis}
          width={56}
        />
        <Tooltip
          contentStyle={{
            background: COLORS.tooltipBg,
            border: `1px solid ${COLORS.tooltipBorder}`,
            borderRadius: 4,
            fontSize: 12,
          }}
          formatter={(v) => (typeof v === "number" ? v.toFixed(4) : v)}
        />
        <Legend />
        <Scatter
          name="Data"
          data={data}
          fill={COLORS.dots}
          opacity={0.75}
          r={4}
        />
        {curve.length > 0 && (
          <Line
            name="Fitted curve"
            data={curve}
            dataKey="y"
            dot={false}
            stroke={COLORS.curve}
            strokeWidth={2}
            type="monotone"
            isAnimationActive={false}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  )
}
