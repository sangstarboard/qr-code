"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/components/ui/table";
import CameraScanner from "./camera-scanner"
import ImageScanner from "./image-scanner"
import History from "./history"
import { useQRCodeHistory } from "@/hooks/useQRCodeHistory";

export default function QRReader() {
  const [mode, setMode] = useState<"camera" | "image" | null>(null)
  const [history, setHistory] = useState<string[]>([])

  const addToHistory = async (url: string) => {
    setHistory((prev) => [...new Set([url, ...prev])]);

    try {
      const response = await fetch("/api/qr-code-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          describe: "",
          qrType: mode,
        }),
      });

      if (!response.ok) {
        throw new Error("Cannot save QR code history");
      }

      const newHistory = await response.json();
      console.log("QR history saved:", newHistory);
    } catch (error) {
      console.error("Error saving QR scan history:", error);
    }
  };

  const qrCodeHistories = useQRCodeHistory(10);

  return (
  <div>
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

    <Table className="w-full max-w-4xl table-auto mx-auto border border-gray-300 rounded-lg mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center border border-gray-300 font-bold">No.</TableHead>
            <TableHead className="text-left border border-gray-300 font-bold">URL</TableHead>
            <TableHead className="text-center border border-gray-300 font-bold">Loại QR</TableHead>
            <TableHead className="text-center border border-gray-300 font-bold">Số lần quét</TableHead>
            <TableHead className="text-center border border-gray-300 font-bold">Thời gian quét</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {qrCodeHistories.map((history, index) => (
            <TableRow key={history.id}>
              <TableCell className="text-center border border-gray-300">{index + 1}</TableCell>
              <TableCell className="text-left border border-gray-300">
              <a href={history.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {history.url}
              </a>
              </TableCell>
              <TableCell className="text-center border border-gray-300">{history.qrType}</TableCell>
              <TableCell className="text-center border border-gray-300">{history.scanCount}</TableCell>
              <TableCell className="text-center border border-gray-300">{new Date(history.updatedAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  </div>
  )
}

