import { useState, useMemo, useEffect, useRef } from "react";
import BlogSearchBar from "../components/blog/BlogSearchBar";
import BlogTable from "../components/blog/BlogTable";
import BlogPagination from "../components/blog/BlogPagination";
import BlogFormModal from "../components/blog/BlogFormModal";
import BlogDetail from "../components/blog/BlogDetail";
import CategoryTable from "../components/blog/CategoryTable";
import type { User } from "../components/user/types";
import { FileText, PlusIcon, FunnelIcon } from "lucide-react";
import { getBlogsAll, getBlogsCategoryAll, createBlog, updateBlog, deleteBlog, createBlogCategory, updateBlogCategory } from "../services/blogs";
import { useToast } from "../components/common/ToastContext";
import { useUserStore } from "../store/userStore";

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

const BlogManagement = () => {
    const [activeTab, setActiveTab] = useState<"blogs" | "categories">("blogs");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<BlogApiResponse | null>(null);
    const sortRef = useRef<HTMLDivElement>(null);
    
    const [blogs, setBlogs] = useState<BlogApiResponse[]>([]);
    const [categories, setCategories] = useState<CategoryApiResponse[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<"title" | "view" | "emojis" | "createdDate" | "">("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<BlogApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const blogsPerPage = 5;
    const { addToast } = useToast();
    const { user } = useUserStore();

    // Fetch blogs from API
    const fetchBlogs = async () => {
        try {
            setIsLoading(true);
            const response = await getBlogsAll({ page: 1, size: 1000 });
            // Use API response directly without transformation
            setBlogs(response.data.content);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            addToast("Lỗi khi tải danh sách blog", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const response = await getBlogsCategoryAll({ page: 1, size: 1000 });
            setCategories(response.data.content || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            addToast("Lỗi khi tải danh sách danh mục", "error");
        }
    };

    useEffect(() => {
        fetchBlogs();
        fetchCategories();
    }, []);

    // Filter blogs
    const filteredBlogs = useMemo(() => {
        if (!searchTerm) return blogs;
        const term = searchTerm.toLowerCase();
        return blogs.filter(
            (blog) =>
                blog.title.toLowerCase().includes(term) ||
                blog.slugName.toLowerCase().includes(term) ||
                blog.categoryName.toLowerCase().includes(term)
        );
    }, [blogs, searchTerm]);

    // Sort blogs
    const sortedBlogs = useMemo(() => {
        if (!sortField) return filteredBlogs;
        return [...filteredBlogs].sort((a, b) => {
            let aValue: any;
            let bValue: any;
            
            if (sortField === "createdDate") {
                aValue = new Date(a[sortField]).getTime();
                bValue = new Date(b[sortField]).getTime();
            } else {
                aValue = a[sortField];
                bValue = b[sortField];
            }
            
            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredBlogs, sortField, sortDirection]);

    // Pagination
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = sortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(sortedBlogs.length / blogsPerPage);

    const handleSort = (field: "title" | "view" | "emojis" | "createdDate") => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const handleDeleteBlog = async (id: string) => {
        if (window.confirm("Bạn có chắc muốn xóa blog này?")) {
            try {
                // Call the deleteBlog API
                await deleteBlog(id);
                
                // Refresh the blog list
                await fetchBlogs();
                addToast("Blog đã được xóa thành công!", "success");
            } catch (error) {
                console.error("Error deleting blog:", error);
                addToast("Có lỗi xảy ra khi xóa blog. Vui lòng thử lại.", "error");
            }
        }
    };

    const handleSaveBlog = async (blog: BlogApiResponse) => {
        try {
            // Get the selected category
            const selectedCategory = categories.find(c => c.name === blog.categoryName);
            
            if (!selectedCategory) {
                addToast("Không tìm thấy danh mục đã chọn", "error");
                return;
            }
            
            if (!user) {
                addToast("Vui lòng đăng nhập để tạo blog", "error");
                return;
            }
            
            // Create the request object in the correct format
            const blogRequest = {
                title: blog.title,
                content: blog.content,
                image: blog.image,
                view: blog.view,
                userId: user.userId,
                categoryId: selectedCategory.id
            };
            
            if (editingBlog) {
                // For editing, call the updateBlog API
                const response = await updateBlog(editingBlog.id, blogRequest);
                
                // Update the blog in the list
                const updatedBlog: BlogApiResponse = {
                    ...blog,
                    id: response.data.id || editingBlog.id,
                    createdDate: editingBlog.createdDate, // Keep original created date
                    userName: user.username,
                    fullname: user.username
                };
                
                setBlogs(blogs.map((b) => (b.id === editingBlog.id ? updatedBlog : b)));
                addToast("Blog đã được cập nhật thành công!", "success");
            } else {
                // For creating new blog, call the createBlog API
                const response = await createBlog(blogRequest);
                
                // Add the new blog to the list
                const newBlog: BlogApiResponse = {
                    ...blog,
                    id: response.data.id || `new-${Date.now()}`,
                    createdDate: new Date().toISOString(),
                    userName: user.username,
                    fullname: user.username
                };
                
                setBlogs([...blogs, newBlog]);
                addToast("Blog đã được tạo thành công!", "success");
            }
            
            // Refresh the blog list to ensure consistency
            await fetchBlogs();
        } catch (error) {
            console.error("Error saving blog:", error);
            if (editingBlog) {
                addToast("Có lỗi xảy ra khi cập nhật blog. Vui lòng thử lại.", "error");
            } else {
                addToast("Có lỗi xảy ra khi tạo blog. Vui lòng thử lại.", "error");
            }
        }
        
        setIsModalOpen(false);
    };

    const handleUpdateCategory = async (category: CategoryApiResponse): Promise<void> => {
        try {
            console.log("handleUpdateCategory called with:", category);
            // If category has an ID, it's an update operation
            if (category.id && category.id.trim() !== "") {
                console.log("Updating existing category with ID:", category.id);
                // It's an existing category, call the API to update it
                const categoryRequest = {
                    name: category.name,
                    isActive: category.isActive
                };
                
                const response = await updateBlogCategory(category.id, categoryRequest);
                
                // Update the category with the data from the API response
                const updatedCategory: CategoryApiResponse = {
                    ...category,
                    id: response.data.id || category.id,
                    createdDate: response.data.createdDate || category.createdDate
                };
                
                setCategories(categories.map((c) => (c.id === category.id ? updatedCategory : c)));
                addToast("Danh mục đã được cập nhật thành công!", "success");
            } else {
                console.log("Creating new category");
                // It's a new category, call the API to create it
                const categoryRequest = {
                    name: category.name,
                    isActive: category.isActive
                };
                
                const response = await createBlogCategory(categoryRequest);
                
                // Add the new category with the ID from the API response
                const newCategory: CategoryApiResponse = {
                    ...category,
                    id: response.data.id || `c${Date.now()}`,
                    createdDate: new Date().toISOString()
                };
                
                setCategories([...categories, newCategory]);
                addToast("Danh mục đã được tạo thành công!", "success");
            }
        } catch (error) {
            console.error("Error saving category:", error);
            addToast("Có lỗi xảy ra khi lưu danh mục. Vui lòng thử lại.", "error");
            throw error; // Re-throw the error so the modal knows about it
        }
    };

    const handleViewBlogDetails = (blog: BlogApiResponse) => {
        setSelectedBlog(blog);
    };

    const handleBackFromBlogDetail = () => {
        setSelectedBlog(null);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const sortOptions = [
        { value: "", label: "Sắp xếp" },
        { value: "title", label: "Theo tiêu đề" },
        { value: "view", label: "Theo lượt xem" },
        { value: "emojis", label: "Theo biểu cảm" },
        { value: "createdDate", label: "Theo ngày tạo" },
    ];

    const currentSortLabel = sortOptions.find(option => option.value === sortField)?.label || "Sắp xếp";

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-green-400 rounded-xl">
                            <FileText className="w-7 h-7 text-white" />
                        </div>
                        Quản lý Blog
                    </h1>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <nav className="flex">
                        <button
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                                activeTab === "blogs"
                                    ? "bg-green-400 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                            onClick={() => setActiveTab("blogs")}
                        >
                            Danh sách blog
                        </button>
                        <button
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                                activeTab === "categories"
                                    ? "bg-green-400 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                            onClick={() => setActiveTab("categories")}
                        >
                            Danh mục
                        </button>
                    </nav>
                </div>

                {/* Content */}
                {activeTab === "blogs" ? (
                    <div className="space-y-6">
                        {/* Enhanced Sort control and Add button */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <button
                                    onClick={() => {
                                        setEditingBlog(null);
                                        setIsModalOpen(true);
                                    }}
                                    className="px-6 py-3 bg-green-400 text-white font-semibold rounded-xl hover:bg-green-500 flex items-center gap-2 shadow-sm transition-all transform hover:scale-105"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    <span>Thêm blog</span>
                                </button>
                                
                                <div ref={sortRef} className="relative">
                                    <button
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                        className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                        <FunnelIcon className="w-5 h-5 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">{currentSortLabel}</span>
                                        <svg className={`w-4 h-4 text-gray-600 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    
                                    {isSortOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10 overflow-hidden">
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setSortField(option.value as any);
                                                        setCurrentPage(1);
                                                        setIsSortOpen(false);
                                                    }}
                                                    className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                                                        sortField === option.value
                                                            ? "bg-green-50 text-green-700 font-medium"
                                                            : "text-gray-700 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Blog Detail View or Blog Table */}
                        {selectedBlog ? (
                            <BlogDetail 
                                blog={selectedBlog} 
                                onBack={handleBackFromBlogDetail} 
                            />
                        ) : (
                            <>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                    {isLoading ? (
                                        <div className="flex justify-center items-center h-64">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                                        </div>
                                    ) : (
                                        <BlogTable
                                            blogs={currentBlogs}
                                            categories={categories}
                                            users={users}
                                            sortField={sortField}
                                            sortDirection={sortDirection}
                                            handleSort={handleSort}
                                            handleDelete={handleDeleteBlog}
                                            onEdit={(blog) => {
                                                setEditingBlog(blog);
                                                setIsModalOpen(true);
                                            }}
                                            onViewDetails={handleViewBlogDetails}
                                        />
                                    )}
                                </div>
                                
                                <BlogPagination 
                                    currentPage={currentPage} 
                                    totalPages={totalPages} 
                                    totalItems={sortedBlogs.length}
                                    itemsPerPage={blogsPerPage}
                                    onPageChange={(pageNumber: number) => setCurrentPage(pageNumber)}
                                />
                            </>
                        )}

                        <BlogFormModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSave={handleSaveBlog}
                            categories={categories}
                            users={users}
                            initialData={editingBlog}
                        />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <button
                                onClick={() => {
                                    // We need to trigger the CategoryTable's create function
                                    // Since CategoryTable manages its own state, we'll need to pass a prop
                                    // For now, we'll just open the modal directly
                                    const event = new CustomEvent('openCategoryModal');
                                    window.dispatchEvent(event);
                                }}
                                className="px-6 py-3 bg-green-400 text-white font-semibold rounded-xl hover:bg-green-500 flex items-center gap-2 shadow-sm transition-all transform hover:scale-105"
                            >
                                <PlusIcon className="w-5 h-5" />
                                <span>Thêm danh mục</span>
                            </button>
                        </div>
                        
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <CategoryTable
                                categories={categories}
                                onUpdate={handleUpdateCategory}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogManagement;