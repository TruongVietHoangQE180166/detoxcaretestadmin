import { useState, useEffect } from "react";
import ProductTable from "../components/product/ProductTable";
import type { Product, TypeProduct } from "../components/product/types";
import Pagination from "../components/product/Pagination";
import ProductFormModal from "../components/product/ProductFormModal";
import { PlusIcon } from "@heroicons/react/16/solid";
import TypeProductTable from "../components/product/TypeProductTable";
import TypeProductFormModal from "../components/product/TypeProductFormModal";
import { Package } from "lucide-react";
import type { Query } from "../services/common/queryCommon";
import { getAllProduct, getTypeProducts } from "../services/product/productService";

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState<"products" | "types">("products");

  // --- PRODUCTS ---
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // --- TYPE PRODUCTS ---
  const [typeProducts, setTypeProducts] = useState<TypeProduct[]>([]);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<TypeProduct | null>(null);

  // --- SORT ---
  const [sortOption, setSortOption] = useState<"none" | "name" | "price" | "status">("none");

  const query: Query = {
    page: currentPage,
    size: 5,
    field: sortOption === "price" ? "price" : sortOption === "name" ? "name" : "createdDate",
    direction: sortOption === "status" ? "desc" : "desc",
  };


  const fetchDataProducts = async () => {
      try {
        const data = await getAllProduct(query);
        console.log("Fetched products:", data.data.content);
        setProducts(data.data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Lỗi fetch products:", error);
      }
    };

 
  // --- HANDLERS ---
  const handleSaveProduct = (product: Product) => {
    // TODO: Gọi API POST/PUT
    console.log("Save product", product);
  };

  const handleDeleteProduct = (p: Product) => {
    // TODO: Gọi API DELETE
    console.log("Delete product", p);
  };

  const handleSaveType = (tp: TypeProduct) => {
    // TODO: Gọi API POST/PUT
    console.log("Save type", tp);
  };

  const handleDeleteType = (tp: TypeProduct) => {
    // TODO: Gọi API DELETE
    console.log("Delete type", tp);
  };


   // --- FETCH PRODUCTS ---
  useEffect(() => {
    fetchDataProducts();
  }, [currentPage, sortOption]);

    // --- FETCH TYPE PRODUCTS ---
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const data = await getTypeProducts();
        setTypeProducts(data);
      } catch (error) {
        console.error("Lỗi fetch typeProducts:", error);
      }
    };
    fetchTypes();
  }, []);

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
            products={products}
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
