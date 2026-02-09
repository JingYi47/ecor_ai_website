import Header from "../../components/Header";
import Footer from "../../components/footer";
import "./CartPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockCarts } from "../../data/cart";

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(mockCarts.items || []);

  // đổi số lượng
  const handleQuantityChange = (id, value) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: value } : item
      )
    );
  };

  // xoá sản phẩm
  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  // tổng tiền
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.priceAtAddition * item.quantity,
    0
  );

  const finalTotal = Math.max(totalPrice - mockCarts.discountApplied, 0);

  // CHECKOUT
  const handleCheckout = () => {
    const selectedItems = cartItems.filter((item) => item.isSelected);

    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }

    const checkoutData = {
      items: selectedItems.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.priceAtAddition,
        quantity: item.quantity,
        color: item.color,
        total: item.priceAtAddition * item.quantity,
        image: item.product.image,
      })),
      subtotal: totalPrice,
      shippingFee: 0,
      discount: mockCarts.discountApplied,
      total: finalTotal,
    };

    navigate("/payment", { state: checkoutData });
  };

  return (
    <>
      <Header />

      <main className="cp-page">
        <div className="cp-container">
          <div className="cp-layout">
            {/* LEFT */}
            <div className="cp-left">
              <div className="cp-header">
                <span>Sản phẩm</span>
                <span>Giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
              </div>

              {cartItems.length === 0 && (
                <p className="cp-empty">Giỏ hàng của bạn đang trống 🛒</p>
              )}

              {cartItems.map((item) => (
                <div className="cp-item" key={item._id}>
                  <div className="cp-product">
                    <input type="checkbox" checked={item.isSelected} readOnly />
                    <img src={item.product.image} alt={item.product.name} />
                    <div>
                      <span>{item.product.name}</span>
                      <small>Màu: {item.color}</small>
                    </div>
                  </div>

                  <div className="cp-price">
                    {item.priceAtAddition.toLocaleString()}đ
                  </div>

                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item._id, Number(e.target.value))
                    }
                  >
                    {[1, 2, 3, 4, 5].map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>

                  <div className="cp-total">
                    {(item.priceAtAddition * item.quantity).toLocaleString()}đ
                  </div>

                  <button
                    className="cp-remove"
                    onClick={() => removeItem(item._id)}
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="cp-right">
              <div className="cp-coupon">
                <input placeholder="Mã khuyến mãi" />
                <button>Áp dụng</button>
              </div>

              <div className="cp-summary">
                <h3>Tổng cộng</h3>

                <div className="cp-row">
                  <span>Tổng tiền hàng</span>
                  <span>{totalPrice.toLocaleString()}đ</span>
                </div>

                <div className="cp-row">
                  <span>Phí vận chuyển</span>
                  <span>Free</span>
                </div>

                <div className="cp-row">
                  <span>Khuyến mãi</span>
                  <span>-{mockCarts.discountApplied.toLocaleString()}đ</span>
                </div>

                <hr />

                <div className="cp-row cp-final">
                  <span>Tổng thanh toán</span>
                  <span>{finalTotal.toLocaleString()}đ</span>
                </div>
              </div>

              <div className="cp-actions">
                <button className="cp-back" onClick={() => navigate(-1)}>
                  Quay lại
                </button>
                <button className="cp-checkout" onClick={handleCheckout}>
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
