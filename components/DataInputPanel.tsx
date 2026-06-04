'use client'

import { useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { parseCsv, parseManual } from "@/lib/data"
import type { DataPoint } from "@/lib/types"

interface Props {
  onDataChange: (points: DataPoint[]) => void
}

export default function DataInputPanel({ onDataChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [csvInfo, setCsvInfo] = useState<{ name: string; count: number } | null>(null)
  const [pasteText, setPasteText] = useState("")
  const [pasteCount, setPasteCount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  async function handleFile(file: File) {
    setError(null)
    try {
      const points = await parseCsv(file)
      setCsvInfo({ name: file.name, count: points.length })
      onDataChange(points)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  function handlePasteCommit() {
    setError(null)
    if (!pasteText.trim()) return
    try {
      const points = parseManual(pasteText)
      setPasteCount(points.length)
      onDataChange(points)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div className="space-y-3 text-sm">
      <Tabs defaultValue="csv">
        <TabsList className="w-full">
          <TabsTrigger value="csv" className="flex-1 text-xs">CSV Upload</TabsTrigger>
          <TabsTrigger value="paste" className="flex-1 text-xs">Paste</TabsTrigger>
        </TabsList>

        <TabsContent value="csv" className="mt-3">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              const file = e.dataTransfer.files[0]
              if (file) handleFile(file)
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border border-dashed cursor-pointer transition-colors
              flex flex-col items-center justify-center gap-1 py-5 px-3 text-center
              ${isDragging ? "border-foreground bg-muted" : "border-border hover:border-foreground/40"}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
            {csvInfo ? (
              <>
                <span className="font-medium text-foreground truncate max-w-full">{csvInfo.name}</span>
                <span className="text-xs text-muted-foreground">{csvInfo.count} points loaded</span>
              </>
            ) : (
              <>
                <span className="text-muted-foreground text-xs">Drop .csv or click to browse</span>
                <span className="text-[10px] text-muted-foreground/60">Needs x and y columns</span>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="paste" className="mt-3 space-y-2">
          <Textarea
            placeholder={"0, 0\n1, 1.1\n2, 3.9\n3, 9.2"}
            className="font-mono text-xs h-32 resize-none"
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <Button size="sm" variant="secondary" className="text-xs h-7" onClick={handlePasteCommit}>
              Apply
            </Button>
            {pasteCount !== null && (
              <span className="text-xs text-muted-foreground">{pasteCount} points</span>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <p className="text-xs text-destructive border border-destructive/30 bg-destructive/5 px-2 py-1.5">
          {error}
        </p>
      )}
    </div>
  )
}
