import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1, min: 1 },
        addedAt: { type: Date, default: Date.now },
        // Giá tại thời điểm thêm vào giỏ (để giữ giá cố định)
        priceAtAddition: { type: Number },
      },
    ],

    // Coupon
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
    discountApplied: { type: Number, default: 0 },

    lastViewedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastViewedAt: { type: Date },

    isAbandoned: { type: Boolean, default: false },
    abandonedAt: { type: Date },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Cart = mongoose.model("Cart", cartSchema);
