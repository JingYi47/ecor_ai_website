import { Checkout } from "../models/checkoutModel.js";
import { Cart } from "../models/cartModel.js";
import { Coupon } from "../models/couponModel.js";

//Tạo đơn
export const createCheckout = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, couponCode } = req.body;

    //Kiểm tra thông tin giao hàng
    if (
      !shippingAddress?.fullName ||
      !shippingAddress?.phone ||
      !shippingAddress?.address
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin giao hàng",
      });
    }

    // Kiểm tra phương thức thanh toán
    const allowedMethods = ["COD", "MOMO", "VNPAY"];
    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Phương thức thanh toán không hợp lệ",
      });
    }

    // Lấy giỏ hàng
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng đang trống",
      });
    }

    //Chỉ lấy item được tick
    const selectedItems = cart.items.filter((i) => i.isSelected);
    if (selectedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Bạn chưa chọn sản phẩm để thanh toán",
      });
    }

    // Snapshot item
    let subtotal = 0;

    const checkoutItems = selectedItems.map((item) => {
      const total = item.priceAtAddition * item.quantity;
      subtotal += total;

      return {
        product: item.product._id,
        name: item.product.name,
        price: item.priceAtAddition,
        quantity: item.quantity,
        color: item.color,
        total,
      };
    });

    // Tính phí vận chuyển
    const shippingFee = subtotal >= 500000 ? 0 : 30000;

    //Áp mã giảm giá
    let discount = 0;
    let couponDoc = null;

    if (couponCode) {
      couponDoc = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });

      if (!couponDoc) {
        return res.status(400).json({
          success: false,
          message: "Mã giảm giá không hợp lệ",
        });
      }

      const now = new Date();

      // Kiểm tra thời gian áp dụng
      if (couponDoc.startDate > now || couponDoc.expiryDate < now) {
        return res.status(400).json({
          success: false,
          message: "Mã giảm giá đã hết hạn hoặc chưa tới thời gian sử dụng",
        });
      }

      // Kiểm tra giá trị đơn tối thiểu
      if (couponDoc.minOrderValue && subtotal < couponDoc.minOrderValue) {
        return res.status(400).json({
          success: false,
          message: "Đơn hàng chưa đủ điều kiện áp dụng mã giảm giá",
        });
      }

      // Tính discount
      if (couponDoc.discountType === "percentage") {
        discount = (subtotal * couponDoc.discountValue) / 100;

        if (couponDoc.maxDiscount) {
          discount = Math.min(discount, couponDoc.maxDiscount);
        }
      } else if (couponDoc.discountType === "fixed") {
        discount = couponDoc.discountValue;
      } else if (couponDoc.discountType === "free_shipping") {
        discount = shippingFee;
      }
    }

    // Tổng tiền cuối
    const total = Math.max(subtotal + shippingFee - discount, 0);

    // Tạo checkout
    const checkout = await Checkout.create({
      user: req.user._id,
      items: checkoutItems,
      shippingAddress,
      subtotal,
      shippingFee,
      discount,
      total,
      coupon: couponDoc?._id,
      paymentMethod,
      status: "pending",
    });
    // Clear item đã checkout khỏi cart
    cart.items = cart.items.filter((i) => !i.isSelected);
    cart.discountApplied = 0;
    await cart.save();

    if (couponDoc) {
      couponDoc.usedCount += 1;
      couponDoc.totalDiscountGiven += discount;
      await couponDoc.save();
    }

    return res.status(201).json({
      success: true,
      message: "Tạo checkout thành công",
      checkout,
    });
  } catch (error) {
    console.error("Lỗi createCheckout:", error);
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi tạo checkout",
    });
  }
};

// lấy đơn
export const getMyCheckouts = async (req, res) => {
  const checkouts = await Checkout.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    checkouts,
  });
};

// cập nhật trạng thái
export const updateCheckoutStatus = async (req, res) => {
  const { status } = req.body;

  const allowedStatus = [
    "pending",
    "paid",
    "shipping",
    "completed",
    "cancelled",
  ];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Trạng thái đơn hàng không hợp lệ",
    });
  }

  const checkout = await Checkout.findById(req.params.id);
  if (!checkout) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy đơn checkout",
    });
  }

  checkout.status = status;
  await checkout.save();

  res.json({
    success: true,
    message: "Cập nhật trạng thái thành công",
    checkout,
  });
};
// xem chi tiết đơn hàng
// export const getCheckoutById = async (req, res) => {
//   try {
//     console.log("REQ USER:", req.user);

//     const checkout = await Checkout.findById(req.params.id)
//       .populate("user", "firstName lastName email role")

//       .populate("items.product", "name price");

//     if (!checkout) {
//       return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
//     }

//     // chỉ cho chủ đơn hoặc admin xem
//     if (
//       checkout.user._id.toString() !== req.user._id.toString() &&
//       req.user.role !== "admin"
//     ) {
//       return res.status(403).json({ message: "Không có quyền truy cập" });
//     }
//     console.log("Checkout ID:", req.params.id);

//     const checkoutId = req.params.id;
//     console.log("CHECKOUT ID SEND:", checkoutId, checkoutId.length);

//     res.json(checkout);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// // admin xem tất cả đơn
// export const getAllCheckouts = async (req, res) => {
//   try {
//     const checkouts = await Checkout.find()
//       .populate("user", "firstName lastName email role")
//       .sort({ createdAt: -1 });

//     res.json(checkouts);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
export const getCheckoutById = async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id)
      .populate("user", "firstName lastName email role")
      .populate("items.product", "name price");

    if (!checkout) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // kiểm tra req.user tồn tại
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    // console.log("CHECKOUT:", checkout);
    // kiểm tra quyền
    const isOwner =
      checkout.user && checkout.user._id.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    return res.json({
      success: true,
      checkout,
    });
  } catch (err) {
    console.error("getCheckoutById error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};
