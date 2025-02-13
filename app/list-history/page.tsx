"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table,TableBody ,TableCell ,TableRow  ,TableHead,TableHeader  } from "@/components/ui/table"
import { Pagination,PaginationItem ,PaginationPrevious ,PaginationNext  ,PaginationEllipsis,PaginationLink,PaginationContent } from "@/components/ui/pagination"
import { useQRCodeHistory, useQRCodeHistoryWithSearch } from "@/hooks/useQRCodeHistory";

export default function ListHistory() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 1;

  const { paginatedHistories, total } = useQRCodeHistoryWithSearch(searchQuery, currentPage, pageSize);

  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-md p-2 mb-4 border rounded-md"
      />

      <Table className="w-full max-w-4xl table-auto mx-auto border border-gray-300 rounded-lg">
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
          {paginatedHistories.map((history, index) => (
            <TableRow key={history.id}>
              <TableCell className="text-center border border-gray-300">{index + 1 + (currentPage - 1) * pageSize}</TableCell>
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

      {/* Pagination */}
      <Pagination className="mt-4">
        <PaginationContent>
          {/* Previous Page Button */}
          <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          
          {/* Pagination Links */}
          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          {/* Next Page Button */}
          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        </PaginationContent>
      </Pagination>

      <Button className="mt-4" onClick={() => window.history.back()}>Back</Button>
    </div>
  )
}

