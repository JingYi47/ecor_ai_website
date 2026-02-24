import { useState } from "react";

export default function ProfileContent({ title }) {
  const [formData] = useState({
    firstName: "Văn",
    lastName: "Thanh",
    email: "Thanhvan@gmail.com",
    address: "123",
  });

  return (
    <div className="profile-container">
      <h2>{title || "Chỉnh sửa hồ sơ của bạn"}</h2>

      <div className="form-row">
        <div className="form-group">
          <label>Tên</label>
          <input value={formData.firstName} disabled />
        </div>

        <div className="form-group">
          <label>Họ</label>
          <input value={formData.lastName} disabled />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email</label>
          <input value={formData.email} disabled />
        </div>

        <div className="form-group">
          <label>Địa chỉ</label>
          <input value={formData.address} disabled />
        </div>
      </div>

      <h4 className="password-title">Đổi mật khẩu</h4>

      <input placeholder="Current Password" type="password" />
      <input placeholder="New Password" type="password" />
      <input placeholder="Confirm New Password" type="password" />

      <div className="profile-actions">
        <button className="cancel-btn">Hủy</button>
        <button className="save-btn">Lưu thay đổi</button>
      </div>
    </div>
  );
}