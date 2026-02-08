import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.css";
import logologin from "../../assets/logologin.jpg";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="register-wrapper">
      <div className="register-container">

        <div className="register-left">
          <h1>
            Welcome to <br /> PandoraPro!!
          </h1>
          <img src={logologin} alt="logo" className="logo-left" />
        </div>

        <div className="register-right">
          <h2>Đăng ký</h2>

          <input
            className="input-field"
            type="text"
            placeholder="Nhập địa chỉ Email"
          />

          {/* PASSWORD */}
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

          {/* CONFIRM PASSWORD */}
          <div className="password-field">
            <input
              className="input-field"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại Password"
            />
            <span
              className="eye-icon"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            <p className="login-text">
              Đã có tài khoản? <a href="/login">Đăng nhập</a>
            </p>
          </div>

          <button className="register-btn">Đăng ký</button>

          <p className="register-divider">
            <span>Hoặc đăng ký với</span>
          </p>

          <div className="google-btn">
            Sign up with Google
          </div>
        </div>

      </div>
    </div>
  );
}
