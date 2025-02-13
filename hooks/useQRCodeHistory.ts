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
        setQrCodeHistories(data.slice(0, limit)); // Giới hạn chỉ lấy 10 bản ghi
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
        setQrCodeHistories(data);
      }
      fetchQRCodeHistories();
    }, []);
  
    // Lọc dữ liệu theo searchQuery
    const filteredHistories = qrCodeHistories.filter((history) => {
      const query = searchQuery.toLowerCase();
      return (
        history.url.toLowerCase().includes(query) ||
        history.describe.toLowerCase().includes(query) ||
        history.qrType.toLowerCase().includes(query)
      );
    });
  
    // Xử lý phân trang: giới hạn số lượng kết quả theo pageSize và page
    const paginatedHistories = filteredHistories.slice((page - 1) * pageSize, page * pageSize);
  
    return { paginatedHistories, total: filteredHistories.length };
  }