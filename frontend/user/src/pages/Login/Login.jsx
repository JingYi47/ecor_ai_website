import "./Login.css";
import logologin from "../../assets/logologin.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // fake check
    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // giả lập user
    const fakeUser = {
      email,
      name: "Jay",
    };

    localStorage.setItem("user", JSON.stringify(fakeUser));

    // quay về trang chủ
    navigate("/");
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* LEFT */}
        <div className="login-left">
          <h1>
            Welcome to <br /> PandoraPro!!
          </h1>
          <img src={logologin} alt="logo" className="logo-left" />
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <h2>Đăng nhập</h2>

          <input
            type="text"
            placeholder="Nhập địa chỉ Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="register-text">
            Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
          </p>

          <button onClick={handleLogin}>Đăng nhập</button>

          <p className="login-divider">
            <span>Hoặc đăng nhập với</span>
          </p>

          <div className="google-btn">Sign up with Google</div>
        </div>
      </div>
    </div>
  );
}
