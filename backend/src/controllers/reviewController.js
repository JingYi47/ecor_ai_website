import { Review } from "../models/reviewModel.js";
import { Product } from "../models/productModel.js";

export const createOrUpdateReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;

    let review = await Review.findOne({ user: userId, product: productId });

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

    //Tính lại rating cho Product
    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (stats.length) {
      await Product.findByIdAndUpdate(productId, {
        rating: stats[0].avgRating,
        reviewCount: stats[0].count,
      });
    }

    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
