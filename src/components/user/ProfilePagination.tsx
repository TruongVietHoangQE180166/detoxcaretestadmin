import { useState } from "react";

type ProfilePaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};

const ProfilePagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: ProfilePaginationProps) => {
  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null;

  const [inputPage, setInputPage] = useState(currentPage.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setInputPage(value);
    }
  };

  const handleInputBlur = () => {
    const page = parseInt(inputPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      // Reset to current page if invalid
      setInputPage(currentPage.toString());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show around current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  // Calculate item range for current page
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Page info */}
      <div className="text-sm text-gray-600">
        Hiển thị <span className="font-medium">{startItem}</span> đến <span className="font-medium">{endItem}</span> trong tổng số <span className="font-medium">{totalItems}</span> hồ sơ
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Page input */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Trang:</span>
          <div className="relative">
            <input
              type="text"
              value={inputPage}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyPress={handleKeyPress}
              className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <span className="text-sm text-gray-600">/ {totalPages}</span>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center space-x-1">
          {/* Previous button */}
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`px-4 py-2 rounded-xl transition-all ${
              currentPage === 1 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200 shadow-sm"
            }`}
          >
            ← Trước
          </button>

          {/* Page numbers */}
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-500">
                  ...
                </span>
              );
            }

            return (
              <button
                key={page as number}
                onClick={() => onPageChange(page as number)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  page === currentPage
                    ? "bg-green-400 text-white font-medium shadow-md hover:bg-green-500"
                    : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200 shadow-sm"
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next button */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`px-4 py-2 rounded-xl transition-all ${
              currentPage === totalPages 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200 shadow-sm"
            }`}
          >
            Sau →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePagination;