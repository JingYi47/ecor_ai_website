import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          Pandora<span>Pro</span>
        </div>

        <nav className="menu">
          <a className="menu-item">Trang Chủ</a>
          <a className="menu-item">Giới Thiệu</a>

          <div className="menu-item dropdown-parent">
            <span>Sản Phẩm</span>
            <button className="dropdown-btn" onClick={() => setOpen(!open)}>
              ▼
            </button>

            {open && (
              <div className="dropdown">
                <p>IPhone</p>
                <p>Laptop</p>
                <p>Mini Speakers</p>
                <p>Headphones</p>
                <p>IPad</p>
              </div>
            )}
          </div>

          <a className="menu-item">Liên hệ</a>
        </nav>

        <div className="header-actions">
          <input className="search-bar" placeholder="Tìm kiếm..." />
          <div className="cart-icon">🛒</div>

          <button
            className="header-login-btn"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </header>
  );
}
