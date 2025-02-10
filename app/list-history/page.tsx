"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table,TableBody ,TableCell ,TableRow  ,TableHead,TableHeader  } from "@/components/ui/table"

type QRCodeHistory = {
  id: number;
  url: string;
  describe: string;
  qrType: string;
  scanCount: number;
  createdAt: string;
  updatedAt: string;
};
export default function ListHistory() {
 
    const [qrCodeHistories, setQrCodeHistories] = useState<QRCodeHistory[]>([]);
  
    useEffect(() => {
      async function fetchQRCodeHistories() {
        const response = await fetch('/api/qr-code-history');
        const data: QRCodeHistory[] = await response.json();
        setQrCodeHistories(data);
      }
      fetchQRCodeHistories();
    }, []);

  return (
  <div className="flex justify-center mt-4">
      <Table className="w-full max-w-4xl table-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">URL</TableHead>
            <TableHead className="text-center">Mô tả</TableHead>
            <TableHead className="text-center">Loại QR</TableHead>
            <TableHead className="text-center">Số lần quét</TableHead>
            <TableHead className="text-center">Thời gian quét</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {qrCodeHistories.map((history) => (
              <TableRow key={history.id}>
                <TableCell className="text-center">{history.url}</TableCell>
                <TableCell className="text-center">{history.describe}</TableCell>
                <TableCell className="text-center">{history.qrType}</TableCell>
                <TableCell className="text-center">{history.scanCount}</TableCell>
                <TableCell className="text-center">{new Date(history.updatedAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Button onClick={() => window.history.back()}>Back</Button>
  </div>
  )
}

