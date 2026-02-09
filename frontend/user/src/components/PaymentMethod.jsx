export default function PaymentMethod({ paymentMethod, setPaymentMethod }) {
  return (
    <>
      <h3>Phương thức thanh toán</h3>
      <label className="radio">
        <input
          type="radio"
          checked={paymentMethod === "BANK"}
          onChange={() => setPaymentMethod("BANK")}
        />
        Bank
      </label>
      <label className="radio">
        <input
          type="radio"
          checked={paymentMethod === "COD"}
          onChange={() => setPaymentMethod("COD")}
        />
        Thanh toán khi nhận hàng
      </label>
    </>
  );
}
