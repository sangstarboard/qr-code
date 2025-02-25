// hooks/useQRCodeHistory.ts
import { useState, useEffect } from "react";

type QRCodeHistory = {
  id: number;
  url: string;
  describe: string;
  qrType: string;
  scanCount: number;
  createdAt: string;
  updatedAt: string;
};

export function useQRCodeHistory(limit: number = 0) {
  const [qrCodeHistories, setQrCodeHistories] = useState<QRCodeHistory[]>([]);

  useEffect(() => {
    async function fetchQRCodeHistories() {
      const response = await fetch('/api/qr-code-history');
      const data: QRCodeHistory[] = await response.json();

      if (limit > 0) {
        setQrCodeHistories(data.slice(0, limit));
      } else {
        setQrCodeHistories(data);
      }
    }

    fetchQRCodeHistories();
  }, [limit]);

  return qrCodeHistories;
}

export function useQRCodeHistoryWithSearch(searchQuery: string, page: number, pageSize: number) {
  const [qrCodeHistories, setQrCodeHistories] = useState<QRCodeHistory[]>([]);

  useEffect(() => {
    async function fetchQRCodeHistories() {
      const response = await fetch('/api/qr-code-history');
      const data: QRCodeHistory[] = await response.json();
      
      // Sort the data by updatedAt in descending order
      const sortedData = data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      
      setQrCodeHistories(sortedData);
    }
    fetchQRCodeHistories();
  }, []);

  // Filter the data based on the search query
  const filteredHistories = qrCodeHistories.filter((history) => {
    const query = searchQuery.toLowerCase();
    return (
      history.url.toLowerCase().includes(query) ||
      history.describe.toLowerCase().includes(query) ||
      history.qrType.toLowerCase().includes(query)
    );
  });

  // Paginate: Limit the results based on pageSize and page
  const paginatedHistories = filteredHistories.slice((page - 1) * pageSize, page * pageSize);

  return { paginatedHistories, total: filteredHistories.length };
}