import React from "react";
import type { Product } from "./types";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết sản phẩm</h2>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Quay lại
          </button>
        </div>

        <div className="space-y-6">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin sản phẩm</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Tên sản phẩm</p>
                  <p className="font-medium">{product.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Loại sản phẩm</p>
                  <p className="font-medium">{product.typeProduct?.name || "Chưa phân loại"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <p className="font-medium">
                    {product.active ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold border border-green-200">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold border border-gray-300">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        Inactive
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Giá cả</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá gốc</span>
                  <span className="font-medium">{product.price.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá khuyến mãi</span>
                  <span className="font-medium text-green-600">{product.salePrice.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tiết kiệm</span>
                  <span className="font-medium text-green-600">
                    {product.price > 0 
                      ? `${Math.round(((product.price - product.salePrice) / product.price) * 100)}%` 
                      : "0%"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mô tả</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {product.description || "Không có mô tả"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;