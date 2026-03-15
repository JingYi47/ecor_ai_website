import { useState, useEffect } from "react";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ProfileContent() {
  const { updateUser } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    gender: "",
    dateOfBirth: "",
    profilePic: "",
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [msg, setMsg] = useState({ text: "", ok: true });
  const [pwMsg, setPwMsg] = useState({ text: "", ok: true });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  useEffect(() => {
    authApi.getProfile()
      .then((data) => {
        const u = data.user ?? data;
        setForm({
          firstName: u.firstName ?? "",
          lastName: u.lastName ?? "",
          email: u.email ?? "",
          phoneNo: u.phoneNo ?? "",
          address: u.address ?? "",
          city: u.city ?? "",
          zipCode: u.zipCode ?? "",
          gender: u.gender ?? "",
          dateOfBirth: u.dateOfBirth ? u.dateOfBirth.split("T")[0] : "",
          profilePic: u.profilePic ?? "",
        });
      })
      .catch(() => {});
  }, []);

  const showMsg = (text, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg({ text: "", ok: true }), 4000);
  };
  const showPwMsg = (text, ok = true) => {
    setPwMsg({ text, ok });
    setTimeout(() => setPwMsg({ text: "", ok: true }), 4000);
  };

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      showMsg("Họ và tên là bắt buộc", false); return;
    }
    setLoading(true);
    try {
      const updated = await authApi.updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNo: form.phoneNo,
        address: form.address,
        city: form.city,
        zipCode: form.zipCode,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth || undefined,
      });
      updateUser(updated.user ?? updated);
      showMsg("Cập nhật thành công!");
    } catch (err) {
      showMsg(err.message || "Lỗi cập nhật", false);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pw.current || !pw.next) { showPwMsg("Vui lòng điền đầy đủ", false); return; }
    if (pw.next !== pw.confirm) { showPwMsg("Mật khẩu mới không khớp", false); return; }
    if (pw.next.length < 6) { showPwMsg("Mật khẩu mới phải ít nhất 6 ký tự", false); return; }
    setPwLoading(true);
    try {
      await authApi.changePassword(pw.current, pw.next);
      showPwMsg("Đổi mật khẩu thành công!");
      setPw({ current: "", next: "", confirm: "" });
    } catch (err) {
      showPwMsg(err.message || "Lỗi đổi mật khẩu", false);
    } finally {
      setPwLoading(false);
    }
  };

  const avatarLetter = form.firstName ? form.firstName[0].toUpperCase() : "U";

  return (
    <div className="profile-container">
      <h2>Chỉnh sửa hồ sơ của bạn</h2>

      {/* Avatar */}
      <div className="profile-avatar-row">
        {form.profilePic
          ? <img src={form.profilePic} alt="avatar" className="profile-avatar-img" />
          : <div className="profile-avatar-placeholder">{avatarLetter}</div>
        }
        <div>
          <p className="profile-avatar-name">{form.firstName} {form.lastName}</p>
          <p className="profile-avatar-email">{form.email}</p>
        </div>
      </div>

      {msg.text && (
        <p className={`profile-msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</p>
      )}

      {/* Thông tin cơ bản */}
      <div className="form-row">
        <div className="form-group">
          <label>Họ</label>
          <input value={form.firstName} onChange={set("firstName")} placeholder="Nguyễn" />
        </div>
        <div className="form-group">
          <label>Tên</label>
          <input value={form.lastName} onChange={set("lastName")} placeholder="Văn A" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email</label>
          <input value={form.email} disabled />
        </div>
        <div className="form-group">
          <label>Số điện thoại</label>
          <input value={form.phoneNo} onChange={set("phoneNo")} placeholder="09xxxxxxxx" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Giới tính</label>
          <select value={form.gender} onChange={set("gender")} className="profile-select">
            <option value="">-- Chọn --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <div className="form-group">
          <label>Ngày sinh</label>
          <input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group" style={{ flex: 2 }}>
          <label>Địa chỉ</label>
          <input value={form.address} onChange={set("address")} placeholder="Số nhà, tên đường..." />
        </div>
        <div className="form-group">
          <label>Thành phố</label>
          <input value={form.city} onChange={set("city")} placeholder="Hà Nội" />
        </div>
        <div className="form-group" style={{ flex: "0 0 120px" }}>
          <label>Mã bưu chính</label>
          <input value={form.zipCode} onChange={set("zipCode")} placeholder="100000" />
        </div>
      </div>

      <div className="profile-actions" style={{ marginBottom: 32 }}>
        <button className="save-btn" onClick={handleSave} disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>

      {/* Đổi mật khẩu */}
      <div className="profile-password-section">
        <h4 className="password-title">Đổi mật khẩu</h4>
        {pwMsg.text && (
          <p className={`profile-msg ${pwMsg.ok ? "ok" : "err"}`}>{pwMsg.text}</p>
        )}
        <input
          placeholder="Mật khẩu hiện tại"
          type="password"
          value={pw.current}
          onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
        />
        <input
          placeholder="Mật khẩu mới"
          type="password"
          value={pw.next}
          onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))}
        />
        <input
          placeholder="Xác nhận mật khẩu mới"
          type="password"
          value={pw.confirm}
          onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
        />
        <div className="profile-actions">
          <button className="save-btn" onClick={handleChangePassword} disabled={pwLoading}>
            {pwLoading ? "Đang đổi..." : "Đổi mật khẩu"}
          </button>
        </div>
      </div>
    </div>
  );
}