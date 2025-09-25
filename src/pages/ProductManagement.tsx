import { useState, useEffect } from "react";
import ProductTable from "../components/product/ProductTable";
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

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState<"products" | "types">("products");

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
        // Show success message for update
        alert("Cập nhật sản phẩm thành công!");
      } else {
        // For new products
        console.log("Creating new product");
        const result = await createProduct(productData);
        console.log("Product create result:", result);
        // Show success message for creation
        alert("Thêm sản phẩm thành công!");
      }
      
      // Refresh the product list
      console.log("Refreshing product list");
      await fetchDataProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      // Show error message to user
      alert("Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại.");
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
        alert("Xóa sản phẩm thành công!");
        
        // Refresh the product list
        await fetchDataProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        // Show error message to user
        alert("Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.");
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
        // Show success message for update
        alert("Cập nhật loại sản phẩm thành công!");
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
        // Show success message for creation
        alert("Thêm loại sản phẩm thành công!");
      }
      
      // Refresh the type product list
      await fetchTypeProducts();
    } catch (error) {
      console.error("Error saving type product:", error);
      // Show error message to user
      alert("Có lỗi xảy ra khi lưu loại sản phẩm. Vui lòng thử lại.");
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
        alert("Xóa loại sản phẩm thành công!");
        
        // Refresh the type product list
        await fetchTypeProducts();
      } catch (error) {
        console.error("Error deleting type product:", error);
        // Show error message to user
        alert("Có lỗi xảy ra khi xóa loại sản phẩm. Vui lòng thử lại.");
      }
    }
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
          {/* Enhanced Sort control and Add button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div>
              <button
                onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-sm transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Thêm sản phẩm</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-500" />
              <select
                value={sortOption}
                onChange={(e) => { setSortOption(e.target.value as any); setCurrentProductPage(1); }}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="none">-- Sắp xếp --</option>
                <option value="name">Theo tên</option>
                <option value="price">Theo giá</option>
                <option value="status">Theo trạng thái</option>
              </select>
            </div>
          </div>

          <ProductTable
            products={products}
            onEdit={(p) => { setEditingProduct(p); setIsModalOpen(true); }}
            onDelete={handleDeleteProduct}
          />
          <Pagination currentPage={currentProductPage} totalPages={totalProductPages} onPageChange={setCurrentProductPage} />

          <ProductFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveProduct}
            editingProduct={editingProduct}
            typeProducts={allTypeProducts}
          />
        </>
      )}

      {activeTab === "types" && (
        <>
          <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div>
              <button
                onClick={() => { setEditingType(null); setIsTypeModalOpen(true); }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-sm transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Thêm loại sản phẩm</span>
              </button>
            </div>
          </div>
          
          <TypeProductTable
            typeProducts={typeProducts}
            onEdit={(tp) => { setEditingType(tp); setIsTypeModalOpen(true); }}
          />
          <Pagination currentPage={currentTypePage} totalPages={totalTypePages} onPageChange={setCurrentTypePage} />

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