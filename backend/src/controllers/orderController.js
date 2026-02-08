// import { Order } from "../models/orderModel.js";
// import { Checkout } from "../models/checkoutModel.js";

// export const createOrderFromCheckout = async (checkoutId) => {
//   const checkout = await Checkout.findById(checkoutId);

//   if (!checkout) return null;

//   const order = await Order.create({
//     user: checkout.user,
//     checkout: checkout._id,
//     items: checkout.items,
//     shippingAddress: checkout.shippingAddress,
//     subtotal: checkout.subtotal,
//     shippingFee: checkout.shippingFee,
//     discount: checkout.discount,
//     total: checkout.total,
//     paymentMethod: checkout.paymentMethod,
//     paymentStatus: "paid",
//     status: "confirmed",
//   });

//   return order;
// };

import { Order } from "../models/orderModel.js";
import { Checkout } from "../models/checkoutModel.js";

export const createOrderFromCheckout = async (checkoutId) => {
  const checkout = await Checkout.findById(checkoutId);

  if (!checkout) return null;

  // tránh tạo order trùng
  const existedOrder = await Order.findOne({ checkout: checkout._id });
  if (existedOrder) return existedOrder;

  const order = await Order.create({
    user: checkout.user,
    checkout: checkout._id,
    items: checkout.items,
    shippingAddress: checkout.shippingAddress,
    subtotal: checkout.subtotal,
    shippingFee: checkout.shippingFee,
    discount: checkout.discount,
    total: checkout.total,
    paymentMethod: checkout.paymentMethod,
    paymentStatus: checkout.paymentMethod === "COD" ? "unpaid" : "paid",
    status: "confirmed",
  });

  return order;
};

// 1. User xem đơn hàng của mình
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("checkout");

    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

// 2. User xem chi tiết đơn hàng
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "firstName lastName email")
      .populate("items.product", "name price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // chỉ chủ đơn hoặc admin mới xem được
    const isOwner = order.user._id.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

// 3. Tạo order từ checkout
export const createOrderFromCheckoutController = async (req, res) => {
  try {
    const { checkoutId } = req.params;

    const checkout = await Checkout.findById(checkoutId);

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Checkout không tồn tại",
      });
    }

    // chỉ cho chủ checkout tạo order
    if (checkout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền",
      });
    }

    // tránh tạo order trùng
    const existedOrder = await Order.findOne({ checkout: checkout._id });
    if (existedOrder) {
      return res.json({
        success: true,
        order: existedOrder,
      });
    }

    // chỉ tạo order khi checkout đã thanh toán
    if (checkout.paymentMethod !== "COD" && checkout.status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Checkout chưa thanh toán",
      });
    }

    const order = await Order.create({
      user: checkout.user,
      checkout: checkout._id,
      items: checkout.items,
      shippingAddress: checkout.shippingAddress,
      subtotal: checkout.subtotal,
      shippingFee: checkout.shippingFee,
      discount: checkout.discount,
      total: checkout.total,
      paymentMethod: checkout.paymentMethod,
      paymentStatus: checkout.paymentMethod === "COD" ? "unpaid" : "paid",
      status: "confirmed",
    });

    // cập nhật checkout
    checkout.status = "paid";
    await checkout.save();

    res.status(201).json({
      success: true,
      message: "Tạo order thành công",
      order,
    });
  } catch (err) {
    console.error("createOrderFromCheckout error:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

// 4. Admin xem tất cả đơn
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

// 5. Admin cập nhật trạng thái đơn
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = ["confirmed", "shipping", "completed", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};
