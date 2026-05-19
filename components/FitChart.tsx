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
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="x"
          type="number"
          name="x"
          domain={["auto", "auto"]}
          tick={{ fontSize: 11 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          dataKey="y"
          type="number"
          name="y"
          domain={["auto", "auto"]}
          tick={{ fontSize: 11 }}
          stroke="hsl(var(--muted-foreground))"
          width={48}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(v) => (typeof v === "number" ? v.toFixed(4) : v)}
        />
        <Legend />
        <Scatter
          name="Data"
          data={data}
          fill="hsl(var(--primary))"
          opacity={0.8}
        />
        {curve.length > 0 && (
          <Line
            name="Fitted curve"
            data={curve}
            dataKey="y"
            dot={false}
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            type="monotone"
            isAnimationActive={false}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  )
}
