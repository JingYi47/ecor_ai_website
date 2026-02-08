import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import logologin from "../../assets/logologin.jpg";

export default function Login() {

  const [showPassword, setShowPassword] = useState(false);

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
            className="input-field"
            type="text"
            placeholder="Nhập địa chỉ Email"
          />

          <div className="password-field">
            <input
              className="input-field"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="extra-row">
            <p className="login-text">Quên mật khẩu?</p>
            <p className="register-text">
              Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
            </p>
          </div>

          <button className="login-btn">Đăng nhập</button>

          <p className="login-divider">
            <span>Hoặc đăng nhập với</span>
          </p>

          <div className="google-btn">
            Sign up with Google
          </div>
        </div>

      </div>
    </div>
  );
}
