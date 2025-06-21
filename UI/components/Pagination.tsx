import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = [];
  
  // Always include first page
  pages.push(1);
  
  // Calculate range around current page
  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);
  
  // Add ellipsis if needed
  if (startPage > 2) {
    pages.push(-1); // -1 is used as ellipsis indicator
  }
  
  // Add pages around current page
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  // Add ellipsis if needed
  if (endPage < totalPages - 1) {
    pages.push(-2); // -2 is used as ellipsis indicator
  }
  
  // Always include last page if there's more than one page
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  
  return (
    <div className="flex items-center justify-center space-x-2 my-4">
      <button
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      
      {pages.map((page, index) => {
        if (page < 0) {
          // Render ellipsis
          return <span key={`ellipsis-${index}`}>...</span>;
        }
        
        return (
          <button
            key={page}
            className={`px-3 py-1 rounded ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        );
      })}
      
      <button
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
