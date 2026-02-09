export default function ShippingAddress({ shippingAddress }) {
  if (!shippingAddress) return null;

  const { fullName, phone, address, ward, district, province } =
    shippingAddress;

  return (
    <div className="address-box">
      <div>
        <strong>Địa chỉ nhận hàng:</strong>
        <p>
          {fullName} – {phone}
        </p>
        <p>
          {address}, {ward}, {district}, {province}
        </p>
      </div>
      <button className="edit-btn">✏️</button>
    </div>
  );
}
