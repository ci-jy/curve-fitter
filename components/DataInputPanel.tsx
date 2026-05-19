'use client'

import { useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { parseCsv, parseManual } from "@/lib/data"
import type { DataPoint } from "@/lib/types"

interface Props {
  onDataChange: (points: DataPoint[]) => void
}

export default function DataInputPanel({ onDataChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [csvName, setCsvName] = useState<string | null>(null)
  const [csvCount, setCsvCount] = useState<number | null>(null)
  const [pasteText, setPasteText] = useState("")
  const [pasteCount, setPasteCount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  async function handleFile(file: File) {
    setError(null)
    try {
      const points = await parseCsv(file)
      setCsvName(file.name)
      setCsvCount(points.length)
      onDataChange(points)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  function handlePasteCommit(text: string) {
    setError(null)
    if (!text.trim()) return
    try {
      const points = parseManual(text)
      setPasteCount(points.length)
      onDataChange(points)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div className="space-y-2">
      <Tabs defaultValue="csv">
        <TabsList className="w-full">
          <TabsTrigger value="csv" className="flex-1">Upload CSV</TabsTrigger>
          <TabsTrigger value="paste" className="flex-1">Paste Data</TabsTrigger>
        </TabsList>

        <TabsContent value="csv" className="mt-3">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              const file = e.dataTransfer.files[0]
              if (file) handleFile(file)
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
            <p className="text-sm text-muted-foreground">
              Drop a CSV file here, or <span className="text-primary underline">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              File must have <code>x</code> and <code>y</code> columns
            </p>
            {csvName && (
              <div className="mt-2 flex items-center justify-center gap-2">
                <Badge variant="secondary">{csvName}</Badge>
                <Badge>{csvCount} points</Badge>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="paste" className="mt-3 space-y-2">
          <Textarea
            placeholder={"1, 2.3\n2, 4.1\n3, 8.7\n..."}
            className="font-mono text-sm h-40 resize-none"
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handlePasteCommit(pasteText)}
            >
              Apply
            </Button>
            {pasteCount !== null && <Badge>{pasteCount} points loaded</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">
            One <code>x, y</code> pair per line. Spaces, commas, or semicolons as separators.
          </p>
        </TabsContent>
      </Tabs>

      {error && (
        <p className="text-xs text-destructive bg-destructive/10 rounded px-2 py-1">{error}</p>
      )}
    </div>
  )
}
