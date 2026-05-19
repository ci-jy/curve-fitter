import type { TrainingConfig, DataPoint } from "./types"
import {
  normalizeX,
  normalizeY,
  denormalizeY,
  type NormParams,
} from "./data"

// Lazily imported so TF.js only loads client-side
let tf: typeof import("@tensorflow/tfjs") | null = null

async function getTf() {
  if (!tf) tf = await import("@tensorflow/tfjs")
  return tf
}

export async function buildModel(
  config: TrainingConfig
): Promise<import("@tensorflow/tfjs").Sequential> {
  const tfjs = await getTf()
  const model = tfjs.sequential()

  model.add(
    tfjs.layers.dense({
      inputShape: [1],
      units: config.layers[0].neurons,
      activation: config.activation as never,
    })
  )

  for (let i = 1; i < config.layers.length; i++) {
    model.add(
      tfjs.layers.dense({
        units: config.layers[i].neurons,
        activation: config.activation as never,
      })
    )
  }

  model.add(tfjs.layers.dense({ units: 1, activation: "linear" }))

  const optimizer =
    config.optimizer === "sgd"
      ? tfjs.train.sgd(config.lr)
      : config.optimizer === "rmsprop"
      ? tfjs.train.rmsprop(config.lr)
      : tfjs.train.adam(config.lr)

  model.compile({ optimizer, loss: "meanSquaredError" })
  return model
}

export async function trainModel(
  model: import("@tensorflow/tfjs").Sequential,
  points: DataPoint[],
  normParams: NormParams,
  config: TrainingConfig,
  onEpochEnd: (epoch: number, loss: number) => void,
  stopRef: { current: boolean }
): Promise<void> {
  const tfjs = await getTf()

  const xsData = points.map((p) => normalizeX(p.x, normParams))
  const ysData = points.map((p) => normalizeY(p.y, normParams))

  const xs = tfjs.tensor2d(xsData, [xsData.length, 1])
  const ys = tfjs.tensor2d(ysData, [ysData.length, 1])

  try {
    await model.fit(xs, ys, {
      epochs: config.epochs,
      batchSize: config.batchSize,
      shuffle: true,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          const rawLoss = logs?.loss ?? 0
          const loss = typeof rawLoss === "number" ? rawLoss : 0
          onEpochEnd(epoch + 1, loss)
          if (stopRef.current) {
            model.stopTraining = true
          }
        },
      },
    })
  } finally {
    xs.dispose()
    ys.dispose()
  }
}

export async function predict(
  model: import("@tensorflow/tfjs").Sequential,
  normParams: NormParams,
  numPoints = 200
): Promise<DataPoint[]> {
  const tfjs = await getTf()

  const { xMin, xMax } = normParams
  const step = (xMax - xMin) / (numPoints - 1)
  const rawXs = Array.from({ length: numPoints }, (_, i) => xMin + i * step)
  const normXs = rawXs.map((x) => normalizeX(x, normParams))

  const inputTensor = tfjs.tensor2d(normXs, [normXs.length, 1])
  const outputTensor = model.predict(inputTensor) as import("@tensorflow/tfjs").Tensor
  const normYs = Array.from(await outputTensor.data())
  inputTensor.dispose()
  outputTensor.dispose()

  return rawXs.map((x, i) => ({ x, y: denormalizeY(normYs[i], normParams) }))
}
