export interface DataPoint {
  x: number
  y: number
}

export interface LayerConfig {
  neurons: number
}

export interface TrainingConfig {
  layers: LayerConfig[]
  activation: string
  lr: number
  optimizer: string
  epochs: number
  batchSize: number
}

export type TrainingStatus = "idle" | "training" | "stopped" | "done"

export interface TrainingState {
  status: TrainingStatus
  epoch: number
  totalEpochs: number
  loss: number | null
  lossHistory: number[]
}
