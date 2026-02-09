import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [openProduct, setOpenProduct] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const goTo = (path) => {
    navigate(path);
    setOpenProduct(false);
    setOpenUser(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* LOGO */}
        <div className="logo" onClick={() => goTo("/")}>
          Pandora<span>Pro</span>
        </div>

        {/* MENU */}
        <nav className="menu">
          <div className="menu-item" onClick={() => goTo("/")}>
            Trang Chủ
          </div>

          <div className="menu-item">Giới Thiệu</div>

          {/* DROPDOWN SẢN PHẨM */}
          <div className="menu-item dropdown-parent">
            <span onClick={() => setOpenProduct(!openProduct)}>Sản Phẩm</span>
            <button
              className="dropdown-btn"
              onClick={() => setOpenProduct(!openProduct)}
            >
              ▼
            </button>

            {openProduct && (
              <div className="dropdown">
                <p onClick={() => goTo("/iphone")}>iPhone</p>
                <p onClick={() => goTo("/laptop")}>Laptop</p>
                <p onClick={() => goTo("/speaker")}>Mini Speakers</p>
                <p onClick={() => goTo("/headphones")}>Headphones</p>
                <p onClick={() => goTo("/ipad")}>iPad</p>
              </div>
            )}
          </div>

          <div className="menu-item">Liên hệ</div>
        </nav>

        {/* ACTIONS */}
        <div className="header-actions">
          <input className="search-bar" placeholder="Tìm kiếm..." />
          <div
            className="cart-icon"
            onClick={() => navigate("/cart")}
            style={{ cursor: "pointer" }}
          >
            🛒
          </div>

          {/* CHƯA LOGIN */}
          {!user && (
            <button
              className="header-login-btn"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
          )}

          {/* ĐÃ LOGIN */}
          {user && (
            <div className="user-dropdown">
              <button
                className="user-avatar"
                onClick={() => setOpenUser(!openUser)}
              >
                <span className="user-icon">👤</span>
              </button>

              {openUser && (
                <div className="user-menu">
                  <div> Thông tin tài khoản</div>
                  <div onClick={() => goTo("/order")}> Đơn hàng của tôi</div>
                  <div> Đánh giá</div>
                  <div className="logout" onClick={handleLogout}>
                     Đăng xuất
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
