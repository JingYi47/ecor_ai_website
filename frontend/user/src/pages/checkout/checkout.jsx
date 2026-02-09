import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/footer";

import { mockCheckout } from "../../data/mockCheckout";

import ShippingAddress from "../../components/ShippingAddress";
import OrderSummary from "../../components/OrderSummary";
import PaymentMethod from "../../components/PaymentMethod";

import "./checkout.css";

export default function OrderPage() {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState(
    mockCheckout.paymentMethod
  );

  const orderCode = "DH" + Date.now();

  const { items, shippingAddress, subtotal, shippingFee, discount, total } =
    mockCheckout;

  return (
    <>
      <Header />

      <main className="checkout-page">
        <div className="checkout-container">
          {/* LEFT */}
          <div className="checkout-left">
            <h2>Thông tin đơn hàng</h2>

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

            <div className="checkout-actions">
              <button className="btn-back" onClick={() => navigate(-1)}>
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
