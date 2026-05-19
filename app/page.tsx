'use client'

import { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import DataInputPanel from "@/components/DataInputPanel"
import NetworkConfig from "@/components/NetworkConfig"
import TrainingPanel from "@/components/TrainingPanel"
import FitChart from "@/components/FitChart"
import LossChart from "@/components/LossChart"
import ExportPanel from "@/components/ExportPanel"
import type { DataPoint, TrainingConfig, TrainingState } from "@/lib/types"

const INITIAL_TRAINING_STATE: TrainingState = {
  status: "idle",
  epoch: 0,
  totalEpochs: 0,
  loss: null,
  lossHistory: [],
}

const DEFAULT_CONFIG: TrainingConfig = {
  layers: [{ neurons: 32 }, { neurons: 32 }],
  activation: "relu",
  lr: 0.01,
  optimizer: "adam",
  epochs: 300,
  batchSize: 32,
}

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([])
  const [config, setConfig] = useState<TrainingConfig>(DEFAULT_CONFIG)
  const [trainingState, setTrainingState] = useState<TrainingState>(INITIAL_TRAINING_STATE)
  const [curve, setCurve] = useState<DataPoint[]>([])
  const modelRef = useRef<import("@tensorflow/tfjs").Sequential | null>(null)

  function handleStateChange(next: TrainingState | ((prev: TrainingState) => TrainingState)) {
    setTrainingState(next)
  }

  const isDone = trainingState.status === "done" || trainingState.status === "stopped"

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Neural Network Curve Fitter</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Train a neural network in your browser to fit any dataset
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 items-start">
        {/* Left column — controls */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Dataset</CardTitle>
            </CardHeader>
            <CardContent>
              <DataInputPanel
                onDataChange={(pts) => {
                  setData(pts)
                  setCurve([])
                  setTrainingState(INITIAL_TRAINING_STATE)
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Network Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <NetworkConfig onConfigChange={setConfig} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Training</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TrainingPanel
                data={data}
                config={config}
                trainingState={trainingState}
                modelRef={modelRef}
                onStateChange={handleStateChange}
                onCurveUpdate={setCurve}
              />
              {isDone && (
                <>
                  <Separator />
                  <ExportPanel
                    modelRef={modelRef}
                    curve={curve}
                    disabled={!isDone}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column — charts */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Fit
                {data.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    {data.length} points
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 lg:h-96">
                <FitChart data={data} curve={curve} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Training Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 lg:h-56">
                <LossChart history={trainingState.lossHistory} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
