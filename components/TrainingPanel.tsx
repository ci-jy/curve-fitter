'use client'

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { buildModel, trainModel, predict } from "@/lib/nn"
import { computeNormParams } from "@/lib/data"
import type { DataPoint, TrainingConfig, TrainingState } from "@/lib/types"

interface Props {
  data: DataPoint[]
  config: TrainingConfig
  trainingState: TrainingState
  modelRef: React.RefObject<import("@tensorflow/tfjs").Sequential | null>
  onStateChange: (state: TrainingState | ((prev: TrainingState) => TrainingState)) => void
  onCurveUpdate: (curve: DataPoint[]) => void
}

export default function TrainingPanel({
  data,
  config,
  trainingState,
  modelRef,
  onStateChange,
  onCurveUpdate,
}: Props) {
  const stopRef = useRef(false)

  const isTraining = trainingState.status === "training"
  const pct = trainingState.totalEpochs > 0
    ? Math.round((trainingState.epoch / trainingState.totalEpochs) * 100)
    : 0

  async function handleStart() {
    if (data.length < 2) return
    stopRef.current = false

    const normParams = computeNormParams(data)
    const model = await buildModel(config)
    modelRef.current = model

    onStateChange({
      status: "training",
      epoch: 0,
      totalEpochs: config.epochs,
      loss: null,
      lossHistory: [],
    })

    await trainModel(model, data, normParams, config,
      async (epoch, loss) => {
        const curve = await predict(model, normParams)
        onCurveUpdate(curve)
        onStateChange((prev: TrainingState) => ({
          ...prev,
          epoch,
          loss,
          lossHistory: [...prev.lossHistory, loss],
        }))
      },
      stopRef
    )

    onStateChange((prev: TrainingState) => ({
      ...prev,
      status: stopRef.current ? "stopped" : "done",
    }))
  }

  return (
    <div className="space-y-3">
      {isTraining ? (
        <Button onClick={() => { stopRef.current = true }} variant="destructive" className="w-full h-8 text-xs">
          Stop
        </Button>
      ) : (
        <Button onClick={handleStart} disabled={data.length < 2} className="w-full h-8 text-xs">
          {trainingState.status === "idle" ? "Start Training" : "Retrain"}
        </Button>
      )}

      {data.length < 2 && trainingState.status === "idle" && (
        <p className="text-[10px] text-muted-foreground text-center">Load a dataset to begin</p>
      )}

      {trainingState.totalEpochs > 0 && (
        <div className="space-y-2">
          <Progress value={pct} className="h-1" />
          <div className="flex justify-between text-[10px] tabular-nums text-muted-foreground">
            <span>Epoch {trainingState.epoch} / {trainingState.totalEpochs}</span>
            {trainingState.loss !== null && (
              <span>Loss {trainingState.loss.toExponential(3)}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
