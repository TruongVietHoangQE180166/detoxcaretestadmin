import { useState, useMemo } from "react";
import type { Category } from "../blog/types";

type CategoryTableProps = {
  categories: Category[];
  onUpdate: (category: Category) => void;
  onDelete: (id: string) => void;
};

type CategoryFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  initialData?: Category | null;
};

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Category>({
    id: initialData?.id || `c${Date.now()}`,
    name: initialData?.name || "",
    is_active: initialData?.is_active ?? true,
    created_date: initialData?.created_date || new Date().toISOString(),
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "is_active" ? value === "true" : value });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-bold text-green-800 mb-6 tracking-tight">
          {initialData ? "Chỉnh sửa Danh mục" : "Tạo Danh mục Mới"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên Danh mục</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên danh mục"
              className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm text-gray-700 bg-white shadow-sm transition-all duration-200 placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
            <select
              name="is_active"
              value={formData.is_active.toString()}
              onChange={handleChange}
              className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm text-gray-700 bg-white shadow-sm transition-all duration-200"
            >
              <option value="true">Hoạt động</option>
              <option value="false">Không hoạt động</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
          >
            {initialData ? "Cập nhật" : "Tạo"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"name" | "created_date" | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const categoriesPerPage = 5;

  // Search and filter
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    const term = searchTerm.toLowerCase();
    return categories.filter((cat) => cat.name.toLowerCase().includes(term));
  }, [categories, searchTerm]);

  // Sort
  const sortedCategories = useMemo(() => {
    if (!sortField) return filteredCategories;
    return [...filteredCategories].sort((a, b) => {
      let aValue = sortField === "created_date" ? new Date(a[sortField]).getTime() : a[sortField];
      let bValue = sortField === "created_date" ? new Date(b[sortField]).getTime() : b[sortField];
      return aValue < bValue ? (sortDirection === "asc" ? -1 : 1) : aValue > bValue ? (sortDirection === "asc" ? 1 : -1) : 0;
    });
  }, [filteredCategories, sortField, sortDirection]);

  // Pagination
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = sortedCategories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(sortedCategories.length / categoriesPerPage);

  const handleSort = (field: "name" | "created_date") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleSave = (category: Category) => {
    onUpdate(category);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800 tracking-tight">Quản lý Danh mục</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
        >
          Thêm Danh mục
        </button>
      </div>

      {/* Search Box */}
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
            placeholder="Tìm kiếm theo tên danh mục..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 w-full border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm text-gray-700 bg-white shadow-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-xl rounded-xl bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="p-4 text-left text-sm font-semibold uppercase tracking-wide">ID</th>
              <th
                className="p-4 text-left text-sm font-semibold uppercase tracking-wide cursor-pointer hover:bg-green-700 transition-colors duration-150"
                onClick={() => handleSort("name")}
              >
                Tên Danh mục {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-4 text-left text-sm font-semibold uppercase tracking-wide cursor-pointer hover:bg-green-700 transition-colors duration-150"
                onClick={() => handleSort("created_date")}
              >
                Ngày tạo {sortField === "created_date" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-4 text-left text-sm font-semibold uppercase tracking-wide">Trạng thái</th>
              <th className="p-4 text-center text-sm font-semibold uppercase tracking-wide">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((cat, index) => (
              <tr
                key={cat.id}
                className={`${
                  index % 2 === 0 ? "bg-green-50/50" : "bg-white"
                } hover:bg-green-100/70 transition-all duration-200 ease-in-out transform hover:scale-[1.002]`}
              >
                <td className="p-4 text-sm text-gray-800 font-medium border-b border-green-100">{cat.id}</td>
                <td className="p-4 text-sm text-gray-700 border-b border-green-100">{cat.name}</td>
                <td className="p-4 text-sm text-gray-700 border-b border-green-100">
                  {new Date(cat.created_date).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-4 text-sm text-gray-700 border-b border-green-100">
                  {cat.is_active ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      Không hoạt động
                    </span>
                  )}
                </td>
                <td className="p-4 text-center border-b border-green-100">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(cat.id)}
                      className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 px-4">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstCategory + 1} to {Math.min(indexOfLastCategory, sortedCategories.length)} of {sortedCategories.length} entries
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
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
              } transition-colors duration-200`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedCategory}
      />
    </div>
  );
};

export default CategoryTable;