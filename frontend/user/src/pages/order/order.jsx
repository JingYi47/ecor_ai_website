import Header from "../../components/Header";
import Footer from "../../components/footer";
import OrderSection from "../../components/OrderSection";
import { mockOrder } from "../../data/mockOrder";
import "./order.css";

export default function OrderListPage() {
  const pendingOrders = mockOrder.filter(
    (order) => order.status !== "delivered"
  );

  const completedOrders = mockOrder.filter(
    (order) => order.status === "delivered"
  );

  const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN");

  return (
    <>
      <Header />

      <main className="order-page">
        <div className="breadcrumb">
          Trang chủ / <strong>Đơn hàng của tôi</strong>
        </div>

        <OrderSection
          title="ĐANG GIAO"
          orders={pendingOrders}
          formatDate={formatDate}
        />

        <OrderSection
          title="ĐÃ HOÀN THÀNH"
          orders={completedOrders}
          formatDate={formatDate}
        />
      </main>

      <Footer />
    </>
  );
}
