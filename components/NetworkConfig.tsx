'use client'

import { useEffect, useState } from "react"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TrainingConfig } from "@/lib/types"

const NEURON_OPTIONS = [8, 16, 32, 64, 128, 256]

const DEFAULT_CONFIG: TrainingConfig = {
  layers: [{ neurons: 32 }, { neurons: 32 }],
  activation: "relu",
  lr: 0.01,
  optimizer: "adam",
  epochs: 300,
  batchSize: 32,
}

interface Props {
  onConfigChange: (config: TrainingConfig) => void
}

export default function NetworkConfig({ onConfigChange }: Props) {
  const [config, setConfig] = useState<TrainingConfig>(DEFAULT_CONFIG)

  useEffect(() => {
    onConfigChange(config)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function update(partial: Partial<TrainingConfig>) {
    const next = { ...config, ...partial }
    setConfig(next)
    onConfigChange(next)
  }

  function setLayerCount(n: number) {
    const layers = Array.from({ length: n }, (_, i) => config.layers[i] ?? { neurons: 32 })
    update({ layers })
  }

  function setLayerNeurons(idx: number, neurons: number) {
    const layers = config.layers.map((l, i) => (i === idx ? { neurons } : l))
    update({ layers })
  }

  return (
    <div className="space-y-4 text-sm">

      {/* Layers */}
      <Field label="Hidden layers" value={config.layers.length}>
        <Slider min={1} max={6} step={1}
          value={[config.layers.length]}
          onValueChange={([v]) => setLayerCount(v)}
        />
      </Field>

      {/* Per-layer neurons */}
      <div className="space-y-2.5">
        {config.layers.map((layer, i) => (
          <Field key={i} label={`Layer ${i + 1}`} value={`${layer.neurons}n`}>
            <Slider
              min={0} max={NEURON_OPTIONS.length - 1} step={1}
              value={[Math.max(0, NEURON_OPTIONS.indexOf(layer.neurons))]}
              onValueChange={([v]) => setLayerNeurons(i, NEURON_OPTIONS[v])}
            />
          </Field>
        ))}
      </div>

      {/* 2-column selects */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-3">
        <SelectField label="Activation">
          <Select value={config.activation} onValueChange={(v) => update({ activation: v })}>
            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="relu">ReLU</SelectItem>
              <SelectItem value="tanh">Tanh</SelectItem>
              <SelectItem value="sigmoid">Sigmoid</SelectItem>
              <SelectItem value="elu">ELU</SelectItem>
            </SelectContent>
          </Select>
        </SelectField>

        <SelectField label="Optimizer">
          <Select value={config.optimizer} onValueChange={(v) => update({ optimizer: v })}>
            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="adam">Adam</SelectItem>
              <SelectItem value="sgd">SGD</SelectItem>
              <SelectItem value="rmsprop">RMSProp</SelectItem>
            </SelectContent>
          </Select>
        </SelectField>

        <SelectField label="Learn rate">
          <Select value={String(config.lr)} onValueChange={(v) => update({ lr: parseFloat(v) })}>
            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[0.1, 0.01, 0.001, 0.0001].map((v) => (
                <SelectItem key={v} value={String(v)}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SelectField>

        <SelectField label="Batch size">
          <Select value={String(config.batchSize)} onValueChange={(v) => update({ batchSize: parseInt(v) })}>
            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[8, 16, 32, 64].map((n) => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SelectField>
      </div>

      {/* Epochs */}
      <Field label="Epochs" value={config.epochs}>
        <Slider min={10} max={2000} step={10}
          value={[config.epochs]}
          onValueChange={([v]) => update({ epochs: v })}
        />
      </Field>
    </div>
  )
}

function Field({ label, value, children }: { label: string; value: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-medium tabular-nums">{value}</span>
      </div>
      {children}
    </div>
  )
}

function SelectField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}
