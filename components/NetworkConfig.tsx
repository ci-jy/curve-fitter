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
import { Separator } from "@/components/ui/separator"
import type { TrainingConfig } from "@/lib/types"

const NEURON_OPTIONS = [8, 16, 32, 64, 128, 256]
const LR_OPTIONS = [
  { label: "0.1", value: 0.1 },
  { label: "0.01", value: 0.01 },
  { label: "0.001", value: 0.001 },
  { label: "0.0001", value: 0.0001 },
]

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
      <div className="space-y-1">
        <label className="font-medium">Hidden layers: {config.layers.length}</label>
        <Slider
          min={1} max={6} step={1}
          value={[config.layers.length]}
          onValueChange={([v]) => setLayerCount(v)}
        />
      </div>

      {config.layers.map((layer, i) => (
        <div key={i} className="space-y-1">
          <label className="text-muted-foreground">Layer {i + 1}: {layer.neurons} neurons</label>
          <Slider
            min={0} max={NEURON_OPTIONS.length - 1} step={1}
            value={[NEURON_OPTIONS.indexOf(layer.neurons) === -1 ? 2 : NEURON_OPTIONS.indexOf(layer.neurons)]}
            onValueChange={([v]) => setLayerNeurons(i, NEURON_OPTIONS[v])}
          />
        </div>
      ))}

      <Separator />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="font-medium">Activation</label>
          <Select value={config.activation} onValueChange={(v) => update({ activation: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="relu">ReLU</SelectItem>
              <SelectItem value="tanh">Tanh</SelectItem>
              <SelectItem value="sigmoid">Sigmoid</SelectItem>
              <SelectItem value="elu">ELU</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="font-medium">Optimizer</label>
          <Select value={config.optimizer} onValueChange={(v) => update({ optimizer: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="adam">Adam</SelectItem>
              <SelectItem value="sgd">SGD</SelectItem>
              <SelectItem value="rmsprop">RMSProp</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="font-medium">Learning rate</label>
          <Select
            value={String(config.lr)}
            onValueChange={(v) => update({ lr: parseFloat(v) })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {LR_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="font-medium">Batch size</label>
          <Select
            value={String(config.batchSize)}
            onValueChange={(v) => update({ batchSize: parseInt(v) })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {[8, 16, 32, 64].map((n) => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="font-medium">Epochs: {config.epochs}</label>
        <Slider
          min={10} max={2000} step={10}
          value={[config.epochs]}
          onValueChange={([v]) => update({ epochs: v })}
        />
      </div>
    </div>
  )
}
