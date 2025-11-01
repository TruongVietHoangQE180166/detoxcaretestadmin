import { useState, useEffect, useRef } from "react";
import ProductTable from "../components/product/ProductTable";
import ProductDetail from "../components/product/ProductDetail";
import type { Product, TypeProduct } from "../components/product/types";
import Pagination from "../components/product/Pagination";
import ProductFormModal from "../components/product/ProductFormModal";
import { PlusIcon, FunnelIcon } from "@heroicons/react/16/solid";
import TypeProductTable from "../components/product/TypeProductTable";
import TypeProductFormModal from "../components/product/TypeProductFormModal";
import { Package } from "lucide-react";
import type { Query } from "../services/common/queryCommon";
import { 
  getAllProduct, 
  getTypeProducts, 
  updateProduct, 
  createProduct, 
  deleteProduct,
  createTypeProduct,
  updateTypeProduct,
  uploadProductImage
} from "../services/product/productService";
import { useToast } from "../components/common/ToastContext";

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState<"products" | "types">("products");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  // --- PRODUCTS ---
  const [allProducts, setAllProducts] = useState<Product[]>([]); // All products from API
  const [products, setProducts] = useState<Product[]>([]); // Products for current page
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [totalProductPages, setTotalProductPages] = useState(1);
  const productsPerPage = 5; // Same as previous server-side pagination
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // --- TYPE PRODUCTS ---
  const [allTypeProducts, setAllTypeProducts] = useState<TypeProduct[]>([]); // All type products from API
  const [typeProducts, setTypeProducts] = useState<TypeProduct[]>([]); // Type products for current page
  const [currentTypePage, setCurrentTypePage] = useState(1);
  const [totalTypePages, setTotalTypePages] = useState(1);
  const typeProductsPerPage = 5; // Same pagination size
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<TypeProduct | null>(null);

  // --- SORT ---
  const [sortOption, setSortOption] = useState<"none" | "name" | "price" | "status">("none");

  // Query for fetching all products
  const fetchAllQuery: Query = {
    page: 1,
    size: 1000,
    field: sortOption === "price" ? "price" : sortOption === "name" ? "name" : "createdDate",
    direction: sortOption === "status" ? "desc" : "desc",
  };


  const fetchDataProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProduct(fetchAllQuery);
        console.log("Fetched products raw data:", data);
        // Based on your sample data, we need to check the actual structure
        let productsArray: Product[] = [];
        
        // Handle different possible data structures
        if (Array.isArray(data)) {
          productsArray = data;
        } else if (data && typeof data === 'object' && 'content' in data) {
          // If data is an object with a content array (like in your sample)
          productsArray = Array.isArray((data as any).content) ? (data as any).content : [];
        } else if (data && typeof data === 'object') {
          // Check if it's a nested data structure
          const dataObj = data as any;
          if (dataObj.data && typeof dataObj.data === 'object' && 'content' in dataObj.data) {
            // If data is wrapped in another data object
            productsArray = Array.isArray(dataObj.data.content) ? dataObj.data.content : [];
          }
        }
        
        console.log("Processed products array:", productsArray);
        setAllProducts(productsArray);
        
        // Calculate total pages for client-side pagination
        const total = Math.ceil(productsArray.length / productsPerPage);
        setTotalProductPages(total > 0 ? total : 1);
      } catch (error) {
        console.error("Lỗi fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

  // Update products for current page when allProducts or currentPage changes
  useEffect(() => {
    const startIndex = (currentProductPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsForCurrentPage = allProducts.slice(startIndex, endIndex);
    console.log(`Product Pagination: page ${currentProductPage}, showing items ${startIndex} to ${endIndex}`, productsForCurrentPage);
    setProducts(productsForCurrentPage);
  }, [allProducts, currentProductPage]);

  // Update type products for current page
  useEffect(() => {
    const startIndex = (currentTypePage - 1) * typeProductsPerPage;
    const endIndex = startIndex + typeProductsPerPage;
    const typeProductsForCurrentPage = allTypeProducts.slice(startIndex, endIndex);
    console.log(`Type Product Pagination: page ${currentTypePage}, showing items ${startIndex} to ${endIndex}`, typeProductsForCurrentPage);
    setTypeProducts(typeProductsForCurrentPage);
  }, [allTypeProducts, currentTypePage]);

 
  // --- HANDLERS ---
  const handleSaveProduct = async (product: Product) => {
    try {
      console.log("Saving product:", product);
      
      // Prepare the data for API
      const productData = {
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: product.image,
        description: product.description || "",
        typeProductId: product.typeProduct?.id || "",
        active: product.active !== undefined ? product.active : true
      };
      
      console.log("Product data to send:", productData);
      
      // If editing an existing product
      if (product.id) {
        console.log("Updating product with ID:", product.id);
        const result = await updateProduct(product.id, productData);
        console.log("Product update result:", result);
        // Success toast is handled in the ProductFormModal
      } else {
        // For new products
        console.log("Creating new product");
        const result = await createProduct(productData);
        console.log("Product create result:", result);
        // Success toast is handled in the ProductFormModal
      }
      
      // Refresh the product list
      console.log("Refreshing product list");
      await fetchDataProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      // Show error message to user (only for parent-level errors)
      addToast("Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại.", "error");
    }
  };

  const handleDeleteProduct = async (p: Product) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${p.name}" không?`);
    
    if (confirmDelete) {
      try {
        // Call the delete API
        await deleteProduct(p.id);
        
        // Show success message
        addToast("Xóa sản phẩm thành công!", "success");
        
        // Refresh the product list
        await fetchDataProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        // Show error message to user
        addToast("Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.", "error");
      }
    }
  };

  const handleSaveType = async (tp: TypeProduct) => {
    try {
      console.log("Saving type product:", tp);
      
      // If editing an existing type product
      if (tp.id) {
        // Prepare the data for API (PUT request)
        const typeProductData = {
          id: tp.id,
          name: tp.name,
          description: tp.description || "",
          image: tp.image || "",
          deleted: false // Always false as per requirement
        };
        
        console.log("Updating type product with data:", typeProductData);
        const result = await updateTypeProduct(typeProductData);
        console.log("Type product update result:", result);
        // Success toast is handled in the TypeProductFormModal
      } else {
        // For new type products (POST request)
        const typeProductData = {
          name: tp.name,
          description: tp.description || "",
          image: tp.image || ""
        };
        
        console.log("Creating new type product with data:", typeProductData);
        const result = await createTypeProduct(typeProductData);
        console.log("Type product create result:", result);
        // Success toast is handled in the TypeProductFormModal
      }
      
      // Refresh the type product list
      await fetchTypeProducts();
    } catch (error) {
      console.error("Error saving type product:", error);
      // Show error message to user (only for parent-level errors)
      addToast("Có lỗi xảy ra khi lưu loại sản phẩm. Vui lòng thử lại.", "error");
    }
  };

  const handleDeleteType = async (tp: TypeProduct) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa loại sản phẩm "${tp.name}" không?`);
    
    if (confirmDelete) {
      try {
        // For deleting a type product, we'll update it with deleted = true
        const typeProductData = {
          id: tp.id,
          name: tp.name,
          description: tp.description || "",
          image: tp.image || "",
          deleted: true
        };
        
        const result = await updateTypeProduct(typeProductData);
        console.log("Type product delete result:", result);
        
        // Show success message
        addToast("Xóa loại sản phẩm thành công!", "success");
        
        // Refresh the type product list
        await fetchTypeProducts();
      } catch (error) {
        console.error("Error deleting type product:", error);
        // Show error message to user
        addToast("Có lỗi xảy ra khi xóa loại sản phẩm. Vui lòng thử lại.", "error");
      }
    }
  };

  const handleViewProductDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBackFromProductDetail = () => {
    setSelectedProduct(null);
  };


   // --- FETCH PRODUCTS ---
  useEffect(() => {
    fetchDataProducts();
  }, [sortOption]); // Only refetch when sort option changes

  // Initial fetch when component mounts
  useEffect(() => {
    fetchDataProducts();
  }, []);

    // --- FETCH TYPE PRODUCTS ---
  const fetchTypeProducts = async () => {
    try {
      const data = await getTypeProducts();
      console.log("Fetched type products raw data:", data);
      // Handle different possible data structures for type products
      let typeProductsArray: TypeProduct[] = [];
      
      // Handle different possible data structures
      if (Array.isArray(data)) {
        typeProductsArray = data;
      } else if (data && typeof data === 'object' && 'content' in data) {
        // If data is an object with a content array (like in your sample)
        typeProductsArray = Array.isArray((data as any).content) ? (data as any).content : [];
      } else if (data && typeof data === 'object') {
        // Check if it's a nested data structure
        const dataObj = data as any;
        if (dataObj.data && typeof dataObj.data === 'object' && 'content' in dataObj.data) {
          // If data is wrapped in another data object
          typeProductsArray = Array.isArray(dataObj.data.content) ? dataObj.data.content : [];
        }
      }
      
      console.log("Processed type products array:", typeProductsArray);
      setAllTypeProducts(typeProductsArray);
      
      // Calculate total pages for client-side pagination
      const total = Math.ceil(typeProductsArray.length / typeProductsPerPage);
      setTotalTypePages(total > 0 ? total : 1);
    } catch (error) {
      console.error("Lỗi fetch typeProducts:", error);
    }
  };

  useEffect(() => {
    fetchTypeProducts();
  }, []);

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
    { value: "none", label: "Sắp xếp" },
    { value: "name", label: "Theo tên" },
    { value: "price", label: "Theo giá" },
    { value: "status", label: "Theo trạng thái" },
  ];

  const currentSortLabel = sortOptions.find(option => option.value === sortOption)?.label || "Sắp xếp";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-green-400 rounded-xl">
              <Package className="w-7 h-7 text-white" />
            </div>
            Quản lý Sản phẩm
          </h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <nav className="flex">
            <button
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                activeTab === "products"
                  ? "bg-green-400 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("products")}
            >
              Danh sách sản phẩm
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                activeTab === "types"
                  ? "bg-green-400 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("types")}
            >
              Loại sản phẩm
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Enhanced Sort control and Add button */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button
                  onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                  className="px-6 py-3 bg-green-400 text-white font-semibold rounded-xl hover:bg-green-500 flex items-center gap-2 shadow-sm transition-all transform hover:scale-105"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Thêm sản phẩm</span>
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
                            setSortOption(option.value as any);
                            setCurrentProductPage(1);
                            setIsSortOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-3 text-sm transition-colors ${
                            sortOption === option.value
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

            {/* Product Detail View or Product Table */}
            {selectedProduct ? (
              <ProductDetail 
                product={selectedProduct} 
                onBack={handleBackFromProductDetail} 
              />
            ) : (
              <>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                    </div>
                  ) : (
                    <ProductTable
                      products={products}
                      onEdit={(p) => { setEditingProduct(p); setIsModalOpen(true); }}
                      onDelete={handleDeleteProduct}
                      onViewDetails={handleViewProductDetails}
                    />
                  )}
                </div>
                
                {!loading && (
                  <Pagination 
                    currentPage={currentProductPage} 
                    totalPages={totalProductPages} 
                    totalItems={allProducts.length}
                    itemsPerPage={productsPerPage}
                    onPageChange={setCurrentProductPage} 
                  />
                )}
              </>
            )}

            <ProductFormModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveProduct}
              editingProduct={editingProduct}
              typeProducts={allTypeProducts}
            />
          </div>
        )}

        {activeTab === "types" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <button
                onClick={() => { setEditingType(null); setIsTypeModalOpen(true); }}
                className="px-6 py-3 bg-green-400 text-white font-semibold rounded-xl hover:bg-green-500 flex items-center gap-2 shadow-sm transition-all transform hover:scale-105"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Thêm loại sản phẩm</span>
              </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <TypeProductTable
                typeProducts={typeProducts}
                onEdit={(tp) => { setEditingType(tp); setIsTypeModalOpen(true); }}
              />
            </div>
            
            <Pagination 
              currentPage={currentTypePage} 
              totalPages={totalTypePages} 
              totalItems={allTypeProducts.length}
              itemsPerPage={typeProductsPerPage}
              onPageChange={setCurrentTypePage} 
            />

            <TypeProductFormModal
              isOpen={isTypeModalOpen}
              onClose={() => setIsTypeModalOpen(false)}
              onSave={handleSaveType}
              editingTypeProduct={editingType}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;