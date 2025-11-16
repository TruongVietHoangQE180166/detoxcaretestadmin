import { useEffect, useState, useMemo } from "react";
import type { Order } from "../components/order/types";
import OrderTable from "../components/order/OrderTable";
import OrderPagination from "../components/order/OrderPagination";
import { ShoppingCart } from "lucide-react";
import { getAllOrders, updateOrderStatus, getGHNOrderDetail } from "../services/orders";
import type { Query } from "../services/common/queryCommon";
import { useToast } from "../components/common/ToastContext";

// Define the order item type based on the API response
type OrderItem = {
  priceProduct: string;
  salePrice: string;
  productName: string;
  image: string;
  typeProductName: string;
  quantity: number;
  price: number;
};

// Extend the Order type to include order items and other details
type OrderWithItems = Order & {
  orderCode?: string;
  shippingFee?: number;
  expectedDeliveryTime?: string;
  orderItems: OrderItem[];
  createdDate?: string;
};

// Define GHN order detail type
type GHNOrderDetail = {
  status: string;
  order_date: string;
  log: {
    status: string;
    updated_date: string;
  }[] | null;
};

const OrderManagement = () => {
    const { addToast } = useToast();
    const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
    const [orders, setOrders] = useState<OrderWithItems[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [ghnOrderDetail, setGhnOrderDetail] = useState<GHNOrderDetail | null>(null);
    const [ghnLoading, setGhnLoading] = useState(false);
    const ordersPerPage = 5;

    // Filter orders (no sorting in table, but search)
    const filteredOrders = useMemo(() => {
      if (!search) return orders;
      const term = search.toLowerCase();
      return orders.filter(
        (order) =>
          order?.id.toLowerCase().includes(term) ||
          (order?.orderCode && order.orderCode.toLowerCase().includes(term)) ||
          order?.address.toLowerCase().includes(term) ||
          order?.numberPhone.toLowerCase().includes(term) ||
          order?.email.toLowerCase().includes(term)
      );
    }, [orders, search]);

    // Pagination for orders
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const orderTotalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const query: Query = {
      page: currentPage,
      size: 1000,
    };

    const fetchDataOrders = async () => {
        try {
          setLoading(true);
          const data = await getAllOrders(query);
          console.log("Fetched orders:", data.data.content);
          setOrders(data.data.content);
        } catch (error) {
          console.error("Lỗi fetch orders:", error);
          addToast('Có lỗi xảy ra khi tải đơn hàng!', 'error');
        } finally {
          setLoading(false);
        }
      };

    // Add useEffect to fetch orders when component mounts
      useEffect(() => {
        fetchDataOrders();
      }, []);

      const handleView = async (order: OrderWithItems) => {
        setSelectedOrder(order);
        
        // Fetch GHN order detail if order has orderCode
        if (order.orderCode) {
          try {
            setGhnLoading(true);
            const ghnData = await getGHNOrderDetail(order.orderCode);
            setGhnOrderDetail(ghnData.data);
          } catch (error) {
            console.error("Lỗi fetch GHN order detail:", error);
            addToast('Có lỗi xảy ra khi tải thông tin vận chuyển!', 'error');
            setGhnOrderDetail(null);
          } finally {
            setGhnLoading(false);
          }
        }
      };

      const handleBack = () => {
        setSelectedOrder(null);
        setGhnOrderDetail(null);
      };

      const handleUpdateStatus = async (orderId: string, status: 'COMPLETED' | 'CANCELLED') => {
        try {
          await updateOrderStatus(orderId, status);
          
          // Show success message
          addToast(
            status === 'COMPLETED' 
              ? 'Đơn hàng đã được chấp nhận!' 
              : 'Đơn hàng đã bị từ chối!',
            status === 'COMPLETED' ? 'success' : 'error'
          );
          
          // Update the order status in the state instead of reloading the page
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order.id === orderId ? { ...order, status } : order
            )
          );
          
          // Also update the selected order if it's the one being updated
          if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder({ ...selectedOrder, status });
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
          addToast('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!', 'error');
        }
      };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-green-400 rounded-xl">
                            <ShoppingCart className="w-7 h-7 text-white" />
                        </div>
                        Quản lý Orders
                    </h1>
                </div>

                {!selectedOrder ? (
                  <div className="space-y-6">
                    {/* Search */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo Mã đơn hàng, Mã vận đơn, Email, Địa chỉ hoặc SĐT..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Loading indicator for orders */}
                    {loading && (
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                      </div>
                    )}
                    
                    {/* Order Table */}
                    {!loading && (
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                          <OrderTable orders={currentOrders} onView={handleView} />
                      </div>
                    )}
                    
                    {/* Order Pagination */}
                    {!loading && (
                      <OrderPagination 
                        currentPage={currentPage}
                        totalPages={orderTotalPages}
                        totalItems={filteredOrders.length}
                        itemsPerPage={ordersPerPage}
                        onPageChange={setCurrentPage}
                      />
                    )}
                  </div>
                ) : (
                  // Order Detail Section
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Chi tiết đơn hàng #{selectedOrder.id.slice(0, 8)}
                        </h2>
                        <button
                          onClick={handleBack}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Quay lại
                        </button>
                      </div>

                      {/* Order Information - now stacked vertically */}
                      <div className="space-y-6 mb-8">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Thông tin đơn hàng</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Mã đơn hàng:</span>
                              <span className="font-medium">{selectedOrder.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Mã vận đơn:</span>
                              <span className="font-medium">{selectedOrder.orderCode || "Chưa có"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ngày tạo:</span>
                              <span className="font-medium">
                                {selectedOrder.createdDate 
                                  ? new Date(selectedOrder.createdDate).toLocaleString('vi-VN') 
                                  : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Thời gian giao dự kiến:</span>
                              <span className="font-medium">
                                {selectedOrder.expectedDeliveryTime 
                                  ? new Date(selectedOrder.expectedDeliveryTime).toLocaleString('vi-VN') 
                                  : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Trạng thái:</span>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                selectedOrder.status === "COMPLETED"
                                  ? "bg-green-100 text-green-800"
                                  : selectedOrder.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : selectedOrder.status === "CANCELLED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {selectedOrder.status === "COMPLETED"
                                  ? "Hoàn thành"
                                  : selectedOrder.status === "PENDING"
                                  ? "Đang xử lý"
                                  : selectedOrder.status === "CANCELLED"
                                  ? "Đã hủy"
                                  : "Chưa xác định"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Customer Information - now below order information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Thông tin khách hàng</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Email:</span>
                              <span className="font-medium">{selectedOrder.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Địa chỉ:</span>
                              <span className="font-medium">{selectedOrder.address}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Số điện thoại:</span>
                              <span className="font-medium">{selectedOrder.numberPhone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Process Tracking - Only show if order has orderCode */}
                      {selectedOrder.orderCode && (
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Quá trình vận chuyển</h3>
                          {ghnLoading ? (
                            <div className="flex justify-center py-6">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                            </div>
                          ) : ghnOrderDetail ? (
                            ghnOrderDetail.log && ghnOrderDetail.log.length > 0 ? (
                              <div className="space-y-4">
                                {ghnOrderDetail.log.map((logItem, index) => (
                                  <div key={index} className="flex">
                                    <div className="flex flex-col items-center mr-4">
                                      <div className={`w-3 h-3 rounded-full ${
                                        index === ghnOrderDetail.log.length - 1 && ghnOrderDetail.status === logItem.status
                                          ? "bg-green-500"
                                          : "bg-green-300"
                                      }`}></div>
                                      {index !== ghnOrderDetail.log.length - 1 && (
                                        <div className="w-0.5 h-full bg-green-300"></div>
                                      )}
                                    </div>
                                    <div className={`pb-4 ${index === ghnOrderDetail.log.length - 1 ? "" : "mb-2"}`}>
                                      <p className="font-medium text-gray-900">{logItem.status}</p>
                                      <p className="text-sm text-gray-500">
                                        {new Date(logItem.updated_date).toLocaleString('vi-VN')}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 italic">Chưa có thông tin quá trình giao hàng</p>
                            )
                          ) : (
                            <p className="text-gray-500 italic">Chưa có thông tin quá trình giao hàng</p>
                          )}
                        </div>
                      )}

                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Danh sách sản phẩm</h3>
                        <div className="space-y-4">
                          {selectedOrder.orderItems.map((item, index) => {
                            // Use salePrice if available and not zero, otherwise use regular price
                            const displayPrice = (parseFloat(item.salePrice) > 0) 
                              ? parseFloat(item.salePrice) 
                              : parseFloat(item.priceProduct);
                            
                            return (
                              <div key={index} className="flex items-center border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="ml-4 flex-1">
                                  <h4 className="font-medium text-gray-900">{item.productName}</h4>
                                  <p className="text-sm text-gray-500">{item.typeProductName}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900">{displayPrice.toLocaleString('vi-VN')}₫</p>
                                  <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                  <p className="text-sm font-medium text-green-600">
                                    Thành tiền: {(displayPrice * item.quantity).toLocaleString('vi-VN')}₫
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tổng kết đơn hàng</h3>
                        <div className="space-y-3">
                          {/* Calculate sum of all product sale prices */}
                          {(() => {
                            const totalSalePrice = selectedOrder.orderItems.reduce((sum, item) => {
                              const salePrice = parseFloat(item.salePrice) > 0 ? parseFloat(item.salePrice) : parseFloat(item.priceProduct);
                              return sum + (salePrice * item.quantity);
                            }, 0);
                            
                            const voucherDiscount = totalSalePrice - selectedOrder.totalAmount;
                            
                            return (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Tạm tính:</span>
                                  <span>
                                    {selectedOrder.totalAmount.toLocaleString('vi-VN')}₫
                                  </span>
                                </div>
                                
                                {/* Show voucher discount if greater than 0 */}
                                {voucherDiscount > 0 && (
                                  <div className="flex justify-between text-red-600">
                                    <span className="text-gray-600">Voucher giảm giá:</span>
                                    <span>-{voucherDiscount.toLocaleString('vi-VN')}₫</span>
                                  </div>
                                )}
                                
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Phí vận chuyển:</span>
                                  <span>
                                    {(selectedOrder.shippingFee || 0).toLocaleString('vi-VN')}₫
                                  </span>
                                </div>
                                <div className="flex justify-between border-t border-gray-300 pt-3">
                                  <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                                  <span className="text-lg font-bold text-green-600">
                                    {(selectedOrder.totalAmount + (selectedOrder.shippingFee || 0)).toLocaleString('vi-VN')}₫
                                  </span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Action buttons for pending orders - at the bottom */}
                      {selectedOrder.status === "PENDING" && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleUpdateStatus(selectedOrder.id, 'COMPLETED')}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                          >
                            Chấp nhận đơn hàng
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                          >
                            Từ chối đơn hàng
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>
        </div>
    );
};

export default OrderManagement;