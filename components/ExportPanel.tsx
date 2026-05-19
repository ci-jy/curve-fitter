'use client'

import { Button } from "@/components/ui/button"
import type { DataPoint } from "@/lib/types"

interface Props {
  modelRef: React.RefObject<import("@tensorflow/tfjs").Sequential | null>
  curve: DataPoint[]
  disabled: boolean
}

export default function ExportPanel({ modelRef, curve, disabled }: Props) {
  async function handleDownloadModel() {
    if (!modelRef.current) return
    await modelRef.current.save("downloads://curve-fitter-model")
  }

  function handleDownloadPredictions() {
    if (curve.length === 0) return
    const csv = "x,y\n" + curve.map((p) => `${p.x},${p.y}`).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "predictions.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={handleDownloadModel}
      >
        Download model (JSON + weights)
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || curve.length === 0}
        onClick={handleDownloadPredictions}
      >
        Download predictions (CSV)
      </Button>
    </div>
  )
}
