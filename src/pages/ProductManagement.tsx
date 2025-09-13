import { useState } from "react";
import ProductTable from "../components/product/ProductTable";
import type { Product, TypeProduct } from "../components/product/types";
import Pagination from "../components/product/Pagination";
import ProductFormModal from "../components/product/ProductFormModal";
import { PlusIcon } from "@heroicons/react/16/solid";
import TypeProductTable from "../components/product/TypeProductTable";
import TypeProductFormModal from "../components/product/TypeProductFormModal";
import { Package } from "lucide-react";

const ProductManagement = () => {
    const [activeTab, setActiveTab] = useState<"products" | "types">("products");

    // --- PRODUCTS ---
    const [products, setProducts] = useState<Product[]>([
        { id: "1", name: "Detox Chanh Leo", price: 50000, salePrice: 45000, sales: 120, rating: 4.5, image: "https://...", isActive: true, typeProduct: { id: "1", name: "Nước uống", image: "", description: "", is_deleted: false } },
        { id: "2", name: "Detox Dứa", price: 45000, salePrice: 40000, sales: 80, rating: 4.2, image: "https://via.placeholder.com/64", isActive: false, typeProduct: { id: "1", name: "Nước uống", image: "", description: "", is_deleted: false } },
        { id: "3", name: "Combo 7 ngày", price: 300000, salePrice: 270000, sales: 50, rating: 4.8, image: "https://via.placeholder.com/64", isActive: true, typeProduct: { id: "2", name: "Combo", image: "", description: "", is_deleted: false } },
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const totalPages = Math.ceil(products.length / pageSize);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // --- TYPE PRODUCTS ---
    const [typeProducts, setTypeProducts] = useState<TypeProduct[]>([
        { id: "1", name: "Nước uống", image: "", description: "Các loại nước detox", is_deleted: false },
        { id: "2", name: "Combo", image: "", description: "Combo detox nhiều ngày", is_deleted: false },
    ]);

    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
    const [editingType, setEditingType] = useState<TypeProduct | null>(null);

    // --- SORT ---
    const [sortOption, setSortOption] = useState<"none" | "name" | "price" | "status">("none");

    const sortProducts = (data: Product[]) => {
        switch (sortOption) {
            case "name":
                return [...data].sort((a, b) => a.name.localeCompare(b.name));
            case "price":
                return [...data].sort((a, b) => a.price - b.price);
            case "status":
                return [...data].sort((a, b) => Number(b.isActive) - Number(a.isActive)); // true trước
            default:
                return data;
        }
    };

    // --- HANDLERS ---
    const handleSaveProduct = (product: Product) => {
        if (editingProduct) {
            setProducts(products.map(p => p.id === editingProduct.id ? { ...product, id: editingProduct.id } : p));
        } else {
            const newProduct: Product = { ...product, id: (products.length + 1).toString() };
            setProducts([...products, newProduct]);
        }
    };

    const handleDeleteProduct = (p: Product) => {
        setProducts(products.filter(item => item.id !== p.id));
    };

    const handleSaveType = (tp: TypeProduct) => {
        if (editingType) {
            setTypeProducts(typeProducts.map(t => t.id === editingType.id ? { ...tp, id: editingType.id } : t));
        } else {
            const newType: TypeProduct = { ...tp, id: (typeProducts.length + 1).toString() };
            setTypeProducts([...typeProducts, newType]);
        }
    };

    const handleDeleteType = (tp: TypeProduct) => {
        setTypeProducts(typeProducts.filter(item => item.id !== tp.id));
    };

    const currentData = sortProducts(products).slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold text-green-600 flex items-center gap-3">
                <Package className="w-8 h-8" />
                Quản lý Sản phẩm
            </h1>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-6">
                    <button
                        className={`pb-2 ${activeTab === "products" ? "border-b-2 border-green-600 text-green-600 font-semibold" : "text-gray-600"}`}
                        onClick={() => setActiveTab("products")}
                    >
                        Danh sách sản phẩm
                    </button>
                    <button
                        className={`pb-2 ${activeTab === "types" ? "border-b-2 border-green-600 text-green-600 font-semibold" : "text-gray-600"}`}
                        onClick={() => setActiveTab("types")}
                    >
                        Loại sản phẩm
                    </button>
                </nav>
            </div>

            {/* Content */}
            {activeTab === "products" && (
                <>
                    {/* Sort control */}
                    <div className="flex justify-end mb-4">
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value as any)}
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="none">-- Sắp xếp --</option>
                            <option value="name">Theo tên</option>
                            <option value="price">Theo giá</option>
                            <option value="status">Theo trạng thái</option>
                        </select>
                    </div>

                    <ProductTable
                        products={currentData}
                        onEdit={(p) => { setEditingProduct(p); setIsModalOpen(true); }}
                        onDelete={handleDeleteProduct}
                    />
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

                    <div className="mt-6">
                        <button
                            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                            className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2 shadow-md"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Thêm sản phẩm
                        </button>
                    </div>

                    <ProductFormModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveProduct}
                        editingProduct={editingProduct}
                        typeProducts={typeProducts}
                    />
                </>
            )}

            {activeTab === "types" && (
                <>
                    <TypeProductTable
                        typeProducts={typeProducts}
                        onEdit={(tp) => { setEditingType(tp); setIsTypeModalOpen(true); }}
                        onDelete={handleDeleteType}
                    />

                    <div className="mt-6">
                        <button
                            onClick={() => { setEditingType(null); setIsTypeModalOpen(true); }}
                            className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2 shadow-md"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Thêm loại sản phẩm
                        </button>
                    </div>

                    <TypeProductFormModal
                        isOpen={isTypeModalOpen}
                        onClose={() => setIsTypeModalOpen(false)}
                        onSave={handleSaveType}
                        editingTypeProduct={editingType}
                    />
                </>
            )}
        </div>
    );
};

export default ProductManagement;
