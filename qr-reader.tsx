"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CameraScanner from "./camera-scanner"
import ImageScanner from "./image-scanner"
import History from "./history"

export default function QRReader() {
  const [mode, setMode] = useState<"camera" | "image" | null>(null)
  const [history, setHistory] = useState<string[]>([])

  const addToHistory = (url: string) => {
    setHistory((prev) => [...new Set([url, ...prev])])
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>QRコードリーダー</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button onClick={() => setMode("camera")}>カメラ</Button>
          <Button onClick={() => setMode("image")}>画像</Button>
        </div>
        {mode === "camera" && <CameraScanner onScan={addToHistory} />}
        {mode === "image" && <ImageScanner onScan={addToHistory} />}
        <History items={history} />
      </CardContent>
    </Card>
  )
}

