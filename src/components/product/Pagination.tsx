type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null;

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

  return (
    <div className="flex justify-center mt-6 space-x-1">
      {/* Previous button */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-3 py-2 rounded-lg mx-1 transition-colors ${
          currentPage === 1 
            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
            : "bg-white text-gray-700 hover:bg-green-100 hover:text-green-600 border border-gray-200"
        }`}
      >
        ← Trước
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
              ...
            </span>
          );
        }

        return (
          <button
            key={page as number}
            onClick={() => onPageChange(page as number)}
            className={`px-4 py-2 rounded-lg mx-1 transition-colors ${
              page === currentPage
                ? "bg-green-600 text-white font-medium shadow-md"
                : "bg-white text-gray-700 hover:bg-green-100 hover:text-green-600 border border-gray-200"
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
        className={`px-3 py-2 rounded-lg mx-1 transition-colors ${
          currentPage === totalPages 
            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
            : "bg-white text-gray-700 hover:bg-green-100 hover:text-green-600 border border-gray-200"
        }`}
      >
        Sau →
      </button>
    </div>
  );
};

export default Pagination;