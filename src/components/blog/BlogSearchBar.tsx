import React from "react";

type BlogSearchBarProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setCurrentPage: (value: number) => void;
};

const BlogSearchBar: React.FC<BlogSearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  setCurrentPage,
}) => {
  return (
    <div className="flex justify-end mb-6">
      <div className="relative w-full max-w-xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm theo tiêu đề, slug hoặc danh mục..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10 pr-4 py-2 w-full border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm text-gray-700 bg-white shadow-sm transition-all duration-200"
        />
      </div>
    </div>
  );
};

export default BlogSearchBar;
