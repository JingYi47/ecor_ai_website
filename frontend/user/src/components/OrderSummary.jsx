export default function OrderSummary({
  items,
  subtotal,
  shippingFee,
  discount,
  total,
}) {
  return (
    <>
      <div className="checkout-items">
        {items.map((item, index) => (
          <div className="checkout-item" key={index}>
            <div className="item-info">
              <img src="/images/product-placeholder.png" alt={item.name} />
              <span>
                {item.name} x {item.quantity}
              </span>
            </div>
            <span className="item-price">{item.total.toLocaleString()}đ</span>
          </div>
        ))}
      </div>

      <div className="summary">
        <div className="row">
          <span>Tổng tiền hàng</span>
          <span>{subtotal.toLocaleString()}đ</span>
        </div>
        <div className="row">
          <span>Phí vận chuyển</span>
          <span>{shippingFee === 0 ? "Free" : shippingFee}</span>
        </div>
        <div className="row">
          <span>Khuyến mãi</span>
          <span>-{discount.toLocaleString()}đ</span>
        </div>
        <div className="row total">
          <span>Total</span>
          <span>{total.toLocaleString()}đ</span>
        </div>
      </div>
    </>
  );
}
