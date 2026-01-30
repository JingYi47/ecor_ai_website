import { Coupon } from "../models/couponModel.js";

// tạo coupon
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      name,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      usageLimit,
      usageLimitPerUser,
      startDate,
      expiryDate,
      applicableCategories,
      applicableProducts,
      excludeProducts,
      applicableUsers,
      isPublic,
      adminNotes,
    } = req.body;

    const exist = await Coupon.findOne({ code: code.toUpperCase() });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Mã coupon đã tồn tại",
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      name,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      usageLimit,
      usageLimitPerUser,
      startDate,
      expiryDate,
      applicableCategories,
      applicableProducts,
      excludeProducts,
      applicableUsers,
      isPublic,
      adminNotes,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Tạo coupon thành công",
      coupon,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo coupon",
    });
  }
};

// update coupon
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy coupon",
      });
    }

    Object.assign(coupon, req.body, {
      updatedBy: req.user._id,
    });

    await coupon.save();

    res.json({
      success: true,
      message: "Cập nhật coupon thành công",
      coupon,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật coupon",
    });
  }
};

// tắt/ xóa coupon
export const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy coupon",
    });
  }

  coupon.isActive = false;
  await coupon.save();

  res.json({
    success: true,
    message: "Đã vô hiệu hoá coupon",
  });
};

// xem coupon
export const getAllCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    coupons,
  });
};

// lấy coupon còn hiệu lực
export const getPublicCoupons = async (req, res) => {
  const now = new Date();

  const coupons = await Coupon.find({
    isActive: true,
    isPublic: true,
    startDate: { $lte: now },
    expiryDate: { $gte: now },
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    coupons,
  });
};
