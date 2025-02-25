import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/components/ui/table";
import CameraScanner from "./camera-scanner";
import ImageScanner from "./image-scanner";
import Link from 'next/link';
import History from "./history";

export default function QRReader() {
  const [mode, setMode] = useState<"camera" | "image" | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const [qrCodeHistories, setQrCodeHistories] = useState<any[]>([]);

  const fetchQRCodeHistories = async () => {
    try {
      const response = await fetch("/api/qr-code-history");
      const data = await response.json();
      
      // Sort the history by updatedAt in descending order
      const sortedData = data.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      // Set the sorted data (only top 10)
      setQrCodeHistories(sortedData.slice(0, 10));
    } catch (error) {
      console.error("Error fetching QR code histories:", error);
    }
  };

  useEffect(() => {
    fetchQRCodeHistories();
  }, []);

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

      const newHistoryResponse = await response.json();
      const newHistory = newHistoryResponse.data;

      console.log("QR history saved:", newHistory);

      fetchQRCodeHistories();
    } catch (error) {
      console.error("Error saving QR scan history:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-5 mt-8">
      {/* Card Box */}
      <div className="flex justify-center items-center w-full sm:w-1/3 border border-gray-400 rounded-lg p-4">
        <Card className="w-full bg-white rounded-lg shadow-lg p-6">
          <CardHeader className="border-b border-gray-200 pb-4 mb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">QRコードリーダー</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={() => setMode("camera")}
                className="bg-red-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-red-700 transition duration-300 w-full sm:w-auto"
              >
                カメラ
              </Button>
              <Button
                onClick={() => setMode("image")}
                className="bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700 transition duration-300 w-full sm:w-auto"
              >
                画像
              </Button>
              <Link href="/list-history">
                <Button
                  onClick={() => setMode("camera")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300 w-full sm:w-auto"
                >
                  履歴
                </Button>
              </Link>
            </div>
            {mode === "camera" && <CameraScanner onScan={addToHistory} />}
            {mode === "image" && <ImageScanner onScan={addToHistory} />}
          </CardContent>
        </Card>
      </div>

      {/* Table Box */}
      <div className="w-full sm:w-2/3 border-2 border-gray-300 rounded-lg p-4 overflow-x-auto">
        <Table className="table-auto w-full mx-auto rounded-lg mt-4 border-2 border-gray-300 table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center border border-gray-300 font-bold bg-blue-200 text-gray-800 p-4 text-base">
                No.
              </TableHead>
              <TableHead className="text-left border border-gray-300 font-bold bg-blue-200 text-gray-800 p-4 text-base">
                URL
              </TableHead>
              <TableHead className="text-center border border-gray-300 font-bold bg-blue-200 text-gray-800 p-4 text-base">
                Loại QR
              </TableHead>
              <TableHead className="text-center border border-gray-300 font-bold bg-blue-200 text-gray-800 p-4 text-base">
                Số lần quét
              </TableHead>
              <TableHead className="text-center border border-gray-300 font-bold bg-blue-200 text-gray-800 p-4 text-base">
                Thời gian quét
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {qrCodeHistories.map((codehistory, index) => (
              <TableRow key={codehistory.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <TableCell className="text-center border border-gray-300 p-3 text-base">
                  {index + 1}
                </TableCell>
                <TableCell className="text-left border border-gray-300 p-3 text-base max-w-[200px] sm:max-w-[250px] md:max-w-none truncate">
                  <a href={codehistory.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {codehistory.url}
                  </a>
                </TableCell>
                <TableCell className="text-center border border-gray-300 p-3 text-base">
                  {codehistory.qrType}
                </TableCell>
                <TableCell className="text-center border border-gray-300 p-3 text-base">
                  {codehistory.scanCount}
                </TableCell>
                <TableCell className="text-center border border-gray-300 p-3 text-base max-w-[250px] sm:max-w-[300px] md:max-w-none truncate">
                  {new Date(codehistory.updatedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
