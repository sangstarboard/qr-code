"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table,TableBody ,TableCell ,TableRow  ,TableHead,TableHeader  } from "@/components/ui/table"
import { Pagination,PaginationItem ,PaginationPrevious ,PaginationNext  ,PaginationEllipsis,PaginationLink,PaginationContent } from "@/components/ui/pagination"
import { useQRCodeHistory, useQRCodeHistoryWithSearch } from "@/hooks/useQRCodeHistory";

export default function ListHistory() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { paginatedHistories, total } = useQRCodeHistoryWithSearch(searchQuery, currentPage, pageSize);

  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col items-center mt-4 px-4 sm:px-8 lg:px-16">
      {/* Search Input */}
      <div className="w-full max-w-full mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          style={{ fontSize: '16px' }}
        />
      </div>

      {/* Table */}
      <div className="w-full max-w-full overflow-x-auto">
        <Table className="table-auto w-full mx-auto border border-gray-300 rounded-lg shadow-lg table-fixed">
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
            {paginatedHistories.map((history, index) => (
              <TableRow key={history.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <TableCell className="text-center border border-gray-300 p-3 text-base">
                  {index + 1 + (currentPage - 1) * pageSize}
                </TableCell>
                <TableCell className="text-left border border-gray-300 p-3 text-base max-w-[200px] sm:max-w-[250px] md:max-w-none truncate">
                  <a href={history.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {history.url}
                  </a>
                </TableCell>
                <TableCell className="text-center border border-gray-300 p-3 text-base">
                  {history.qrType}
                </TableCell>
                <TableCell className="text-center border border-gray-300 p-3 text-base">
                  {history.scanCount}
                </TableCell>
                <TableCell className="text-center border border-gray-300 p-3 text-base max-w-[250px] sm:max-w-[300px] md:max-w-none truncate">
                  {new Date(history.updatedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    
      {/* Pagination */}
      <div className="mt-6 flex justify-center w-full">
        <Pagination className="flex space-x-2 items-center">
          <PaginationContent>
            {/* Previous Page Button */}
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-300 text-white rounded-md disabled:opacity-50 hover:bg-blue-400 cursor-pointer transition duration-300"
            />
    
            {/* Pagination Links */}
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => handlePageChange(page)}
                    className="px-4 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-400 cursor-pointer transition duration-300"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
    
            {/* Next Page Button */}
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-300 text-white rounded-md disabled:opacity-50 hover:bg-blue-400 cursor-pointer transition duration-300"
            />
          </PaginationContent>
        </Pagination>
      </div>
    
      {/* Back Button */}
      <div className="mt-6">
        <Button className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>
    </div>
  )
}

