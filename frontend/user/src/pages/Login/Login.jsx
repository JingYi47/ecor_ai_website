import "./Login.css";
import logologin from "../../assets/logologin.jpg";

export default function Login() {
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
          <input type="text" placeholder="Nhập địa chỉ Email" />
          <input type="password" placeholder="Password" />
          <p className="register-text">Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>

          <button>Đăng nhập</button>
          <p className="login-divider"> <span>Hoặc đăng nhập với</span></p>
          <div className="google-btn">
            Sign up with Google
          </div>
        </div>
      </div>
    </div>
  );
}
