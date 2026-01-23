import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import "./models/userModel.js";
import "./models/productModel.js";
import "./models/categoryModel.js";
import "./models/orderModel.js";
import "./models/cartModel.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// middleware
app.use(cors()); //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoute);
// http://localhost:8000/api/v1/user/register

connectDB();

app.listen(PORT, () => {
  console.log(`Server is listening at port:${PORT}`);
});
