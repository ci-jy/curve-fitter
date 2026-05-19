import Papa from "papaparse"
import type { DataPoint } from "./types"

export function parseCsv(file: File): Promise<DataPoint[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        try {
          const points = parseRows(results.data)
          resolve(points)
        } catch (e) {
          reject(e)
        }
      },
      error(err) {
        reject(new Error(err.message))
      },
    })
  })
}

function parseRows(rows: Record<string, string>[]): DataPoint[] {
  if (rows.length === 0) throw new Error("CSV is empty")
  const keys = Object.keys(rows[0])
  const xKey = keys.find((k) => k.trim().toLowerCase() === "x")
  const yKey = keys.find((k) => k.trim().toLowerCase() === "y")
  if (!xKey || !yKey) throw new Error('CSV must have columns named "x" and "y"')
  return rows.map((row) => ({
    x: parseFloat(row[xKey]),
    y: parseFloat(row[yKey]),
  })).filter((p) => isFinite(p.x) && isFinite(p.y))
}

export function parseManual(text: string): DataPoint[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      const parts = line.split(/[\s,;]+/)
      const x = parseFloat(parts[0])
      const y = parseFloat(parts[1])
      if (!isFinite(x) || !isFinite(y))
        throw new Error(`Line ${i + 1}: expected two numbers, got "${line}"`)
      return { x, y }
    })
}

export interface NormParams {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

export function computeNormParams(points: DataPoint[]): NormParams {
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  return {
    xMin: Math.min(...xs),
    xMax: Math.max(...xs),
    yMin: Math.min(...ys),
    yMax: Math.max(...ys),
  }
}

export function normalizeX(x: number, p: NormParams): number {
  const range = p.xMax - p.xMin
  return range === 0 ? 0 : (x - p.xMin) / range
}

export function normalizeY(y: number, p: NormParams): number {
  const range = p.yMax - p.yMin
  return range === 0 ? 0 : (y - p.yMin) / range
}

export function denormalizeY(y: number, p: NormParams): number {
  return y * (p.yMax - p.yMin) + p.yMin
}
