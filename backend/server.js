import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/database/db.js";
import userRoute from "./src/routes/userRoute.js";
import adminUserRoutes from "./src/routes/adminUserRoute.js";
import productRoutes from "./src/routes/productRoute.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import checkoutRoutes from "./src/routes/checkoutRoute.js";
import couponRoutes from "./src/routes/couponRoutes.js";
import "./src/models/userModel.js";
import "./src/models/productModel.js";
import "./src/models/categoryModel.js";
import "./src/models/orderModel.js";
import "./src/models/cartModel.js";
import "./src/models/couponModel.js";
import "./src/models/adminlogModel.js";
import "./src/models/view.model.js";
import "./src/models/searchModel.js";
import "./src/models/behaviorModel.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin/users", adminUserRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/coupon", couponRoutes);

// http://localhost:8000/api/v1/user/register

connectDB();

app.listen(PORT, () => {
  console.log(`Server is listening at port:${PORT}`);
});
