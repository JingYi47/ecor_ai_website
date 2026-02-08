import mongoose from "mongoose";
import { Review } from "../models/reviewModel.js";
import { Product } from "../models/productModel.js";
import { Order } from "../models/orderModel.js";

export const createOrUpdateReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;
    const hasBought = await Order.exists({
      user: userId,
      "items.product": productId,
      status: { $in: ["paid", "completed"] },
    });

    if (!hasBought) {
      return res.status(403).json({
        message: "Bạn chỉ có thể đánh giá sản phẩm đã mua",
      });
    }
    let review = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (review) {
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      review = await Review.create({
        user: userId,
        product: productId,
        rating,
        comment,
      });
    }

    // Tính lại rating cho product
    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (stats.length) {
      await Product.findByIdAndUpdate(productId, {
        avgRating: stats[0].avgRating,
        reviewCount: stats[0].reviewCount,
      });
    }

    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
// GET review theo product
// =========================
export const getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;

  const reviews = await Review.find({ product: productId })
    .populate("user", "firstName lastName")
    .sort({ createdAt: -1 });

  res.json(reviews);
};

// =========================
// DELETE review
// =========================
export const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: "Review không tồn tại" });
  }

  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Không có quyền" });
  }

  await review.deleteOne();
  res.json({ message: "Xóa review thành công" });
};
