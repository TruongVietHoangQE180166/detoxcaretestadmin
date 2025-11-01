import { useState, useMemo, useEffect } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import CategoryPagination from "./CategoryPagination";

// Define the Category API response structure
interface CategoryApiResponse {
  id: string;
  createdDate: string;
  name: string;
  isActive: boolean;
}

type CategoryTableProps = {
  categories: CategoryApiResponse[];
  onUpdate: (category: CategoryApiResponse) => Promise<void>;
};

type CategoryFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: CategoryApiResponse) => Promise<void>;
  initialData?: CategoryApiResponse | null;
};

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<CategoryApiResponse>({
    id: initialData?.id || "",
    name: initialData?.name || "",
    isActive: initialData?.isActive ?? true,
    createdDate: initialData?.createdDate || new Date().toISOString(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form data when initialData changes
  useEffect(() => {
    setFormData({
      id: initialData?.id || "",
      name: initialData?.name || "",
      isActive: initialData?.isActive ?? true,
      createdDate: initialData?.createdDate || new Date().toISOString(),
    });
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, isActive: e.target.checked });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log("Saving category data:", formData);
      await onSave(formData);
      onClose();
    } catch (error) {
      // Handle error if needed
      console.error("Error saving category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? "Chỉnh sửa Danh mục" : "Tạo Danh mục Mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tên Danh mục
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên danh mục"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Trạng thái
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                disabled={isSubmitting}
              />
              <label className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className={`px-6 py-3 text-sm font-semibold text-white rounded-xl shadow-sm transform transition-all hover:scale-105 ${
                isSubmitting 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-green-400 hover:bg-green-500"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </div>
              ) : initialData ? (
                "Cập nhật"
              ) : (
                "Tạo"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"name" | "createdDate" | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryApiResponse | null>(null);
  const categoriesPerPage = 5;

  // Handle custom event to open modal
  useEffect(() => {
    const handleOpenModal = () => {
      handleCreate();
    };

    window.addEventListener('openCategoryModal', handleOpenModal);
    return () => {
      window.removeEventListener('openCategoryModal', handleOpenModal);
    };
  }, []);

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
      let aValue = sortField === "createdDate" ? new Date(a[sortField]).getTime() : a[sortField];
      let bValue = sortField === "createdDate" ? new Date(b[sortField]).getTime() : b[sortField];
      return aValue < bValue ? (sortDirection === "asc" ? -1 : 1) : aValue > bValue ? (sortDirection === "asc" ? 1 : -1) : 0;
    });
  }, [filteredCategories, sortField, sortDirection]);

  // Pagination
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = sortedCategories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(sortedCategories.length / categoriesPerPage);

  const handleSort = (field: "name" | "createdDate") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (category: CategoryApiResponse) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleSave = async (category: CategoryApiResponse) => {
    await onUpdate(category);
  };

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý Danh mục</h2>
      </div>

      {/* Search Box */}
      <div className="flex justify-end mb-6">
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
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
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th 
                  className="p-4 font-semibold text-sm cursor-pointer hover:bg-gray-800"
                  onClick={() => handleSort("name")}
                >
                  Tên Danh mục {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="p-4 font-semibold text-sm cursor-pointer hover:bg-gray-800"
                  onClick={() => handleSort("createdDate")}
                >
                  Ngày tạo {sortField === "createdDate" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-4 font-semibold text-sm">Trạng thái</th>
                <th className="p-4 font-semibold text-sm text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentCategories.map((cat, index) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-gray-900 max-w-xs truncate">
                    {cat.name}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(cat.createdDate).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {cat.isActive ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        Không hoạt động
                      </span>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-all transform hover:scale-110 shadow-sm"
                        title="Chỉnh sửa"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {currentCategories.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">Không có danh mục nào</p>
                      <p className="text-gray-400 text-sm">Thêm danh mục mới để bắt đầu</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <CategoryPagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        totalItems={sortedCategories.length}
        itemsPerPage={categoriesPerPage}
        onPageChange={(pageNumber: number) => setCurrentPage(pageNumber)}
      />

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