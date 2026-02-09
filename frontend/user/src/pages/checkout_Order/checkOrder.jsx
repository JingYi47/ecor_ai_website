import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/footer";

import { mockCheckout } from "../../data/mockCheckout";

import ShippingAddress from "../../components/ShippingAddress";
import OrderSummary from "../../components/OrderSummary";
import PaymentMethod from "../../components/PaymentMethod";
import CheckoutActions from "../../components/CheckoutActions";

import "./checkOrder.css";

export default function OrderPage() {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState(
    mockCheckout.paymentMethod
  );

  // FE mock mã đơn hàng
  const orderCode = "DH" + Date.now();

  const { items, shippingAddress, subtotal, shippingFee, discount, total } =
    mockCheckout;

  const handleOrder = () => {
    const orderData = {
      orderCode,
      ...mockCheckout,
      paymentMethod,
    };

    console.log("ORDER MOCK FE:", orderData);
    alert(`Đặt hàng thành công!\nMã đơn: ${orderCode}`);
  };

  return (
    <>
      <Header />

      <main className="checkout-page">
        <div className="checkout-container">
          {/* LEFT */}
          <div className="checkout-left">
            <h2>Thông tin thanh toán</h2>

            <div className="checkout-header">
              <span className="order-code">
                Mã đơn hàng: <strong>{orderCode}</strong>
              </span>
            </div>

            {/* Địa chỉ */}
            <ShippingAddress shippingAddress={shippingAddress} />

            {/* Tóm tắt đơn */}
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shippingFee={shippingFee}
              discount={discount}
              total={total}
            />
          </div>

          {/* RIGHT */}
          <div className="checkout-right">
            <PaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

            <CheckoutActions navigate={navigate} handleOrder={handleOrder} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
