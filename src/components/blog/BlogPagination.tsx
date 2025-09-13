import React from "react";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
  indexOfFirstBlog: number;
  indexOfLastBlog: number;
  totalBlogs: number;
};

const BlogPagination: React.FC<BlogPaginationProps> = ({
  currentPage,
  totalPages,
  paginate,
  indexOfFirstBlog,
  indexOfLastBlog,
  totalBlogs,
}) => {
  return (
    <div className="flex justify-between items-center mt-4 px-4">
      <div className="text-sm text-gray-600">
        Showing {indexOfFirstBlog + 1} to {Math.min(indexOfLastBlog, totalBlogs)} of {totalBlogs} entries
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 text-sm font-medium"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentPage === number
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-green-100"
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 text-sm font-medium"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogPagination;
