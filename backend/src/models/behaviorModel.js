import mongoose from "mongoose";
const userBehaviorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    behaviorType: {
      type: String,
      enum: [
        "view",
        "search",
        "add_to_cart",
        "purchase",
        "wishlist",
        "abandon_cart",
      ],
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    metadata: { type: Map, of: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
