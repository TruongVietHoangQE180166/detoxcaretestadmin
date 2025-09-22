import { useEffect, useState } from "react";
import type { Product, TypeProduct } from "../components/product/types";
import type { Order, OrderDetail } from "../components/order/types";
import OrderTable from "../components/order/OrderTable";
import OrderDetailModal from "../components/order/OrderDetailModal";
import type { Payment } from "../components/payment/types";
import PaymentTable from "../components/payment/PaymentTable";
import { CreditCard } from "lucide-react";
import { getAllOrders } from "../services/orders";
import type { Query } from "../services/common/queryCommon";
import { getAllPayment } from "../services/payment";


// // fake typeProduct
// const fakeTypeProduct: TypeProduct = {
//     id: "t1",
//     name: "Detox",
//     image: "https://via.placeholder.com/60x60.png?text=Detox",
//     description: "Đồ uống Detox thanh lọc cơ thể",
//     is_deleted: false,
// };

// // fake products
// const fakeProducts: Product[] = [
//     {
//         id: "p1",
//         name: "Nước Detox Chanh Leo",
//         price: 30000,
//         salePrice: 25000,
//         sales: 100,
//         rating: 4.5,
//         image: "https://via.placeholder.com/80x80.png?text=Chanh+Leo",
//         isActive: true,
//         typeProduct: fakeTypeProduct,
//     },
//     {
//         id: "p2",
//         name: "Nước Detox Dứa",
//         price: 35000,
//         salePrice: 30000,
//         sales: 120,
//         rating: 4.8,
//         image: "https://via.placeholder.com/80x80.png?text=Dứa",
//         isActive: true,
//         typeProduct: fakeTypeProduct,
//     },
// ];

// // fake orders
// const fakeOrders: Order[] = [
//     {
//         id: "o1",
//         user_id: "u1",
//         address: "123 Nguyễn Trãi, Hà Nội",
//         number_phone: "0379560889",
//         order_status: "COMPLETED",
//         total_amount: 95000,
//         created_date: "2025-09-13",
//     },
// ];

// // fake order details
// const fakeOrderDetails: OrderDetail[] = [
//     {
//         id: "d1",
//         order_id: "o1",
//         product: fakeProducts[0],
//         price: 30000,
//         quantity: 2,
//     },
//     {
//         id: "d2",
//         order_id: "o1",
//         product: fakeProducts[1],
//         price: 35000,
//         quantity: 1,
//     },
// ];





const OrderManagement = () => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"orders" | "payments">("orders");

  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataPayment, setDataPayment] = useState<Payment[]>([]);


  const [sortOption, setSortOption] = useState<"none" | "name" | "price" | "status">("none");

  const query: Query = {
    page: currentPage,
    size: 5,
    field: sortOption === "price" ? "price" : sortOption === "name" ? "name" : "createdDate",
    direction: sortOption === "status" ? "desc" : "desc",
  };

    const fetchDataOrders = async () => {
        try {
          const data = await getAllOrders(query);
          console.log("Fetched products:", data.data.content);
          setOrders(data.data.content);
          setTotalPages(data.totalPages);
        } catch (error) {
          console.error("Lỗi fetch products:", error);
        }
      };

    const fetchDataPayment = async () => {
        try {
          const data = await getAllPayment(query);
          console.log("Fetched products:", data.data.content);
            setDataPayment(data.data.content);
          setTotalPages(data.totalPages);
        } catch (error) {
          console.error("Lỗi fetch products:", error);
        }
      };


    const handleView = (order: Order) => {
        // const details = fakeOrderDetails.filter((d) => d.order_id === order.id);
        setSelectedOrder(order);
        // setOrderDetails(details);
        setIsModalOpen(true);
    };



    
        // --- FETCH TYPE PRODUCTS ---
      useEffect(() => {
        fetchDataOrders();
        fetchDataPayment();
      }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-green-600 flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6" />
                Quản lý Orders & Payments
            </h1>

            {/* Tabs */}
            <div className="flex space-x-4 mb-4">
                <button
                    className={`px-4 py-2 rounded ${activeTab === "orders" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab("orders")}
                >
                    Orders
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTab === "payments" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab("payments")}
                >
                    Payments
                </button>
            </div>

            {/* Content */}
            {activeTab === "orders" ? (
                <>
                    <OrderTable orders={orders} onView={handleView} />
                    {/* <OrderDetailModal
                        isOpen={isModalOpen}
                        order={selectedOrder}
                        orderDetails={orderDetails}
                        onClose={() => setIsModalOpen(false)}
                    /> */}
                </>
            ) : (
                <PaymentTable payments={dataPayment} />
            )}
        </div>
    );
};

export default OrderManagement;
