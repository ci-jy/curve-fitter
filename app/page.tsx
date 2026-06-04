'use client'

import { useRef, useState } from "react"
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

  const isDone = trainingState.status === "done" || trainingState.status === "stopped"

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground">
      {/* Top bar */}
      <header className="flex-none flex items-center justify-between px-5 h-12 border-b border-border">
        <span className="text-sm font-semibold tracking-tight">NN Curve Fitter</span>
        <StatusPill status={trainingState.status} />
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-72 flex-none border-r border-border flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {/* Dataset */}
            <Section label="Dataset">
              <DataInputPanel
                onDataChange={(pts) => {
                  setData(pts)
                  setCurve([])
                  setTrainingState(INITIAL_TRAINING_STATE)
                }}
              />
            </Section>

            <Separator />

            {/* Architecture */}
            <Section label="Architecture">
              <NetworkConfig onConfigChange={setConfig} />
            </Section>

            <Separator />

            {/* Training */}
            <Section label="Training">
              <TrainingPanel
                data={data}
                config={config}
                trainingState={trainingState}
                modelRef={modelRef}
                onStateChange={setTrainingState}
                onCurveUpdate={setCurve}
              />
            </Section>

            {/* Export — only shown when done */}
            {isDone && (
              <>
                <Separator />
                <Section label="Export">
                  <ExportPanel modelRef={modelRef} curve={curve} disabled={!isDone} />
                </Section>
              </>
            )}
          </div>
        </aside>

        {/* Right canvas */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Fit chart — takes most of the space */}
          <div className="flex-1 flex flex-col min-h-0 p-4">
            <ChartLabel>
              Curve Fit
              {data.length > 0 && (
                <span className="ml-2 font-normal text-muted-foreground">{data.length} pts</span>
              )}
            </ChartLabel>
            <div className="flex-1 min-h-0">
              <FitChart data={data} curve={curve} />
            </div>
          </div>

          <Separator />

          {/* Loss chart — fixed height */}
          <div className="h-52 flex flex-col p-4">
            <ChartLabel>Training Loss</ChartLabel>
            <div className="flex-1 min-h-0">
              <LossChart history={trainingState.lossHistory} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-4 space-y-3">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  )
}

function ChartLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
      {children}
    </p>
  )
}

const STATUS_STYLES: Record<TrainingState["status"], string> = {
  idle: "bg-muted text-muted-foreground",
  training: "bg-foreground text-background animate-pulse",
  stopped: "bg-destructive text-destructive-foreground",
  done: "bg-muted text-muted-foreground",
}

const STATUS_LABELS: Record<TrainingState["status"], string> = {
  idle: "Idle",
  training: "Training",
  stopped: "Stopped",
  done: "Done",
}

function StatusPill({ status }: { status: TrainingState["status"] }) {
  return (
    <span className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
