import { useState, useEffect, useRef } from "react";
import type { User } from "../user/types";
import { XMarkIcon, PhotoIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { uploadBlogImage } from "../../services/blogs";
import ReactQuill from 'react-quill-new';
import 'quill/dist/quill.snow.css';
import { useToast } from "../common/ToastContext";

// Define the API response structure
interface BlogApiResponse {
  id: string;
  createdDate: string;
  title: string;
  content: string;
  image: string;
  emojis: number;
  view: boolean;
  userName: string;
  fullname: string;
  categoryName: string;
  slugName: string;
}

// Define the Category API response structure
interface CategoryApiResponse {
  id: string;
  createdDate: string;
  name: string;
  isActive: boolean;
}

type BlogFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (blog: BlogApiResponse) => void;
  categories: CategoryApiResponse[];
  users: User[];
  initialData?: BlogApiResponse | null;
};

const BlogFormModal = ({ isOpen, onClose, onSave, categories, users, initialData }: BlogFormModalProps) => {
  const [formData, setFormData] = useState<BlogApiResponse>({
    id: "",
    createdDate: new Date().toISOString(),
    title: "",
    content: "",
    image: "",
    emojis: 0,
    view: true, // Default to active
    userName: "",
    fullname: "",
    categoryName: categories[0]?.name || "",
    slugName: "",
  });
  
  const [imagePreview, setImagePreview] = useState<string>("");
  const [tempImagePreview, setTempImagePreview] = useState<string>(""); // For temporary preview during upload
  const [error, setError] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // New state for save operation
  const categoryRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setImagePreview(initialData.image || "");
    } else {
      setFormData({
        id: "",
        createdDate: new Date().toISOString(),
        title: "",
        content: "",
        image: "",
        emojis: 0,
        view: true, // Default to active
        userName: "",
        fullname: "",
        categoryName: categories[0]?.name || "",
        slugName: "",
      });
      setImagePreview("");
    }
    setTempImagePreview(""); // Clear temporary preview
    setError(null);
    setIsSaving(false); // Reset saving state when modal opens
  }, [initialData, categories, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create temporary preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Automatically upload the image
      try {
        setIsUploading(true);
        const imageUrl = await uploadBlogImage(file);
        setFormData({ ...formData, image: imageUrl });
        setImagePreview(imageUrl); // Set the final preview only after successful upload
        setTempImagePreview(""); // Clear temporary preview
        addToast("Upload ảnh thành công!", "success");
      } catch (error) {
        console.error("Error uploading image:", error);
        addToast("Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.", "error");
        setImagePreview("");
        setTempImagePreview("");
        setFormData({ ...formData, image: "" });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      return "Vui lòng nhập tiêu đề blog.";
    }
    if (!formData.categoryName) {
      return "Vui lòng chọn danh mục.";
    }
    if (!formData.content.trim()) {
      return "Vui lòng nhập nội dung blog.";
    }
    if (!formData.image) {
      return "Vui lòng tải lên ảnh cho blog.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    
    if (validationError) {
      setError(validationError);
      addToast(validationError, "error");
      return;
    }
    
    setError(null);
    
    // Set saving state and call onSave
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? "Cập nhật blog" : "Thêm blog"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSaving}
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Form Fields - Reorganized */}
          <div className="space-y-5">
            {/* Tiêu đề */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                placeholder="Nhập tiêu đề blog"
                required
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                {/* Danh mục - Custom Dropdown */}
                <div ref={categoryRef}>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="w-full px-4 py-3 text-left border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-white flex justify-between items-center"
                      disabled={isSaving}
                    >
                      <span className={formData.categoryName ? "text-gray-900" : "text-gray-400"}>
                        {formData.categoryName || "-- Chọn danh mục --"}
                      </span>
                      <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isCategoryOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                        <div 
                          className="px-4 py-2 text-sm text-gray-500 cursor-pointer hover:bg-green-50"
                          onClick={() => {
                            setFormData({ ...formData, categoryName: "" });
                            setIsCategoryOpen(false);
                          }}
                        >
                          -- Chọn danh mục -- 
                        </div>
                        {categories.map(category => (
                          <div
                            key={category.id}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-green-50 hover:text-gray-900"
                            onClick={() => {
                              setFormData({ ...formData, categoryName: category.name });
                              setIsCategoryOpen(false);
                            }}
                          >
                            {category.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Status Checkbox */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Trạng thái
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.view}
                      onChange={(e) => setFormData({ ...formData, view: e.target.checked })}
                      className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                      disabled={isSaving}
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Ảnh blog */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Ảnh blog <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Image Preview - Only show after successful upload */}
                  {imagePreview && (
                    <div className="mb-4 flex justify-center">
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-xl border-4 border-gray-200 shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setFormData({ ...formData, image: "" });
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          disabled={isSaving}
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* File Input */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <PhotoIcon className="w-5 h-5" />
                          <span className="font-medium">
                            {isUploading ? "Đang tải..." : "Chọn ảnh"}
                          </span>
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading || isSaving}
                        />
                      </label>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Định dạng: JPG, PNG, GIF. Kích thước tối đa: 5MB
                  </p>
                  
                  {/* Temporary preview during upload */}
                  {tempImagePreview && isUploading && (
                    <div className="mt-4 flex justify-center">
                      <div className="relative">
                        <img
                          src={tempImagePreview}
                          alt="Uploading preview"
                          className="w-32 h-32 object-cover rounded-xl border-4 border-gray-200 shadow-md opacity-50"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nội dung - Moved to the bottom */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                  ]
                }}
                className="h-64"
                readOnly={isSaving}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
              disabled={isSaving}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-semibold bg-green-400 text-white rounded-xl hover:bg-green-500 transition-all shadow-sm transform hover:scale-105 flex items-center gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {initialData ? "Đang cập nhật..." : "Đang thêm..."}
                </>
              ) : (
                initialData ? "Cập nhật" : "Thêm"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogFormModal;