import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    checkout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Checkout",
    },

    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
        color: String,
        total: Number,
      },
    ],

    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      ward: String,
      district: String,
      province: String,
    },

    subtotal: Number,
    shippingFee: Number,
    discount: Number,
    total: Number,

    paymentMethod: String,
    paymentStatus: {
      type: String,
      enum: ["paid", "cod"],
      default: "paid",
    },

    status: {
      type: String,
      enum: ["confirmed", "shipping", "completed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
