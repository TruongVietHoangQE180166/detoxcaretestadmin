import { useState, useMemo } from "react";
import BlogSearchBar from "../components/blog/BlogSearchBar";
import BlogTable from "../components/blog/BlogTable";
import BlogPagination from "../components/blog/BlogPagination";
import BlogFormModal from "../components/blog/BlogFormModal";
import CategoryTable from "../components/blog/CategoryTable";
import type { Blog, Category } from "../components/blog/types";
import type { User } from "../components/user/types";
import { FileText } from "lucide-react";

// Fake categories
const fakeCategories: Category[] = [
    { id: "c1", name: "Thanh Lọc Cơ Thể Toàn Diện", is_active: true, created_date: "2025-09-01" },
    { id: "c2", name: "Giải Nhiệt & Tăng Năng Lượng", is_active: true, created_date: "2025-09-02" },
    { id: "c3", name: "Làm Đẹp Da", is_active: true, created_date: "2025-09-03" },
    { id: "c4", name: "Rau Củ & Thảo Mộc", is_active: true, created_date: "2025-09-04" },
    { id: "c5", name: "Kết Hợp Siêu Hạt & Trà", is_active: true, created_date: "2025-09-05" },
];

// Fake users
const users: User[] = [
    { id: "1", email: "ledoanhieu12a6@gmail.com", username: "otisdoan1", status: "ACTIVE", role_name: "USER", is_deleted: 0, created_date: "2025-09-13" },
    { id: "2", email: "ledo@gmail.com", username: "otisdoan", status: "INACTIVE", role_name: "USER", is_deleted: 0, created_date: "2025-09-12" },
    { id: "3", email: "Thuong123@gmail.com", username: "Thuong123@", status: "ACTIVE", role_name: "USER", is_deleted: 0, created_date: "2025-09-13" },
];

// Fake blogs
const fakeBlogs: Blog[] = [
    {
        id: "b1",
        title: "Detox Detox Giải Nhiệt",
        slug_name: "detox-detox-giai-nhiet",
        image: "https://via.placeholder.com/100x60.png?text=Blog1",
        content: "Vào những ngày hè oi bức...",
        emojis: 0,
        view: 1,
        category: fakeCategories[0],
        user: users[0],
        created_date: "2025-09-10",
    },
    {
        id: "b2",
        title: "Detox Rau Củ & Thảo Mộc",
        slug_name: "detox-rau-cu-thao-moc",
        image: "https://via.placeholder.com/100x60.png?text=Blog2",
        content: "Detox rau củ giúp thanh lọc...",
        emojis: 0,
        view: 2,
        category: fakeCategories[1],
        user: users[0],
        created_date: "2025-09-11",
    },
];

const BlogManagement = () => {
    const [activeTab, setActiveTab] = useState<"blogs" | "categories">("blogs");
    const [blogs, setBlogs] = useState<Blog[]>(fakeBlogs);
    const [categories, setCategories] = useState<Category[]>(fakeCategories);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<"title" | "view" | "emojis" | "created_date" | "">("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const blogsPerPage = 5;

    // Filter blogs
    const filteredBlogs = useMemo(() => {
        if (!searchTerm) return blogs;
        const term = searchTerm.toLowerCase();
        return blogs.filter(
            (blog) =>
                blog.title.toLowerCase().includes(term) ||
                blog.slug_name.toLowerCase().includes(term) ||
                blog.category.name.toLowerCase().includes(term)
        );
    }, [blogs, searchTerm]);

    // Sort blogs
    const sortedBlogs = useMemo(() => {
        if (!sortField) return filteredBlogs;
        return [...filteredBlogs].sort((a, b) => {
            let aValue = sortField === "created_date" ? new Date(a[sortField]).getTime() : a[sortField];
            let bValue = sortField === "created_date" ? new Date(b[sortField]).getTime() : b[sortField];
            return aValue < bValue ? (sortDirection === "asc" ? -1 : 1) : aValue > bValue ? (sortDirection === "asc" ? 1 : -1) : 0;
        });
    }, [filteredBlogs, sortField, sortDirection]);

    // Pagination
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = sortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(sortedBlogs.length / blogsPerPage);

    const handleSort = (field: "title" | "view" | "emojis" | "created_date") => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const handleDeleteBlog = (id: string) => {
        if (window.confirm("Bạn có chắc muốn xóa blog này?")) {
            setBlogs(blogs.filter((b) => b.id !== id));
        }
    };

    const handleSaveBlog = (blog: Blog) => {
        if (editingBlog) {
            setBlogs(blogs.map((b) => (b.id === blog.id ? blog : b)));
        } else {
            setBlogs([...blogs, blog]);
        }
        setIsModalOpen(false);
    };

    const handleUpdateCategory = (category: Category) => {
        if (category.id.startsWith("c")) {
            setCategories(categories.map((c) => (c.id === category.id ? category : c)));
        } else {
            setCategories([...categories, category]);
        }
    };

    const handleDeleteCategory = (id: string) => {
        if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
            setCategories(categories.filter((c) => c.id !== id));
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-green-600 flex items-center gap-3 mb-8 tracking-tight">
                <FileText className="w-8 h-8" />
                Quản lý Blog
            </h1>
            {/* Tabs */}
            <div className="flex space-x-2 mb-6 border-b border-green-200">
                <button
                    onClick={() => setActiveTab("blogs")}
                    className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all duration-200 ${activeTab === "blogs"
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700"
                        }`}
                >
                    Blogs
                </button>
                <button
                    onClick={() => setActiveTab("categories")}
                    className={`px-6 py-3 rounded-t-lg text-sm font-medium transition-all duration-200 ${activeTab === "categories"
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700"
                        }`}
                >
                    Danh mục
                </button>
            </div>

            {/* Content */}
            {activeTab === "blogs" ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <BlogSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
                        <button
                            onClick={() => {
                                setEditingBlog(null);
                                setIsModalOpen(true);
                            }}
                            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium shadow-sm"
                        >
                            + Thêm Blog
                        </button>
                    </div>

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
                    />

                    <BlogPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        paginate={(pageNumber: number) => setCurrentPage(pageNumber)}
                        indexOfFirstBlog={indexOfFirstBlog}
                        indexOfLastBlog={indexOfLastBlog}
                        totalBlogs={sortedBlogs.length}
                    />

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
                <CategoryTable
                    categories={categories}
                    onUpdate={handleUpdateCategory}
                    onDelete={handleDeleteCategory}
                />
            )}
        </div>
    );
};

export default BlogManagement;