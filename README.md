# 🌱 Ecor AI Website – Fullstack Project

## 1. Giới thiệu

**Ecor AI Website** là hệ thống website **thương mại điện tử** được xây dựng theo mô hình **Fullstack**.

Project được tổ chức theo **mono-repo**, bao gồm **Backend + Frontend User + Frontend Admin**, phù hợp cho làm việc nhóm và triển khai thực tế.

### Thành phần chính
- **Backend**: Node.js + Express + MongoDB – cung cấp RESTful API
- **Frontend User**: Website cho người dùng mua sắm
- **Frontend Admin**: Website quản trị dành cho Admin

---

## 2. Kiến trúc tổng thể


Frontend User ──┐
├── REST API ── Backend ── MongoDB
Frontend Admin ──┘


- Backend xử lý nghiệp vụ & dữ liệu  
- Frontend User / Admin gọi API từ Backend  
- Phân quyền rõ ràng giữa **User** và **Admin**

---

## 3. Công nghệ sử dụng

### 3.1 Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- VNPay Payment Gateway
- MoMo Payment Gateway
- dotenv, bcrypt, cors

### 3.2 Frontend User
- React + Vite
- TypeScript
- Axios
- React Router
- CSS / Tailwind CSS (tuỳ cấu hình)

### 3.3 Frontend Admin
- React + Vite
- TypeScript
- Axios
- React Router
- Dashboard quản trị

---

## 4. Cấu trúc thư mục


ecor_ai_website/
│
├── backend/ # Backend Node.js
│ ├── src/
│ │ ├── controllers/ # Xử lý nghiệp vụ
│ │ ├── models/ # Schema MongoDB
│ │ ├── routes/ # Định nghĩa API
│ │ ├── middlewares/ # Auth, phân quyền
│ │ ├── configs/ # Cấu hình DB, payment
│ │ └── utils/ # Hàm hỗ trợ
│ ├── .env # Biến môi trường 
│ ├── server.js
│ └── package.json
│
├── frontend/
│ └── user/ # Frontend người dùng
│ ├── src/
│ ├── public/
│ └── package.json
│
├── pandora-admin/ # Frontend admin
│ ├── src/
│ ├── public/
│ └── package.json
│
├── .gitignore
└── README.md


---

## 5. Yêu cầu môi trường

Trước khi chạy project, cần cài đặt:
- Node.js >= 16
- npm hoặc yarn
- MongoDB (Local hoặc MongoDB Atlas)
- Trình duyệt Chrome / Edge

Kiểm tra:
```bash
node -v
npm -v
6. Clone project
git clone https://github.com/JingYi47/ecor_ai_website.git
cd ecor_ai_website
7. Cài đặt & chạy Backend
7.1 Cài dependencies
cd backend
npm install
7.2 Tạo file .env

Tạo file .env trong thư mục backend/:

PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# VNPay
VNP_TMN_CODE=your_vnpay_code
VNP_HASH_SECRET=your_vnpay_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:8000/api/payment/vnpay-return

# MoMo
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
MOMO_RETURN_URL=http://localhost:8000/api/payment/momo-return



7.3 Chạy Backend
npm run dev

hoặc

npm start

👉 Backend chạy tại:

http://localhost:8000
8. Cài đặt & chạy Frontend User

Mở terminal mới:

cd frontend/user
npm install
npm run dev

👉 Frontend User chạy tại:

http://localhost:5173
9. Cài đặt & chạy Frontend Admin

Mở terminal khác:

cd pandora-admin
npm install
npm run dev

👉 Frontend Admin chạy tại:

http://localhost:5174
10. Thứ tự chạy chuẩn (RẤT QUAN TRỌNG)

1️⃣ Chạy Backend
2️⃣ Chạy Frontend User
3️⃣ Chạy Frontend Admin

👉 Backend chưa chạy → Frontend sẽ không gọi được API

11. Chức năng chính
11.1 Người dùng (User)

Đăng ký / Đăng nhập

Xem & tìm kiếm sản phẩm

Thêm sản phẩm vào giỏ hàng

Đặt hàng & thanh toán

Thanh toán qua VNPay / MoMo

Đánh giá sản phẩm

11.2 Quản trị viên (Admin)

Quản lý sản phẩm

Quản lý người dùng

Quản lý đơn hàng

Theo dõi trạng thái thanh toán

12. Phân quyền & bảo mật

Xác thực bằng JWT

Middleware kiểm tra quyền User / Admin

Bảo vệ các API quan trọng

13. Quy ước Git

Không commit:

node_modules/

.env

main: nhánh chính

Mỗi tính năng → tạo feature branch

Merge thông qua Pull Request

14. Deploy (tham khảo)
Backend

Render / Railway / VPS

Cấu hình biến môi trường .env

Frontend

Vercel / Netlify

Cấu hình URL Backend API

15. Tác giả

Ecor AI Website Team (Nhóm 1)
Fullstack Project – Node.js & React
