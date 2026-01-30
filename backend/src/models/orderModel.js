import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Sản phẩm
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
      },
    ],

    // Thông tin giao hàng
    shippingAddress: {
      fullName: { type: String },
      phone: { type: String },
      address: { type: String },
      city: { type: String },
      district: { type: String },
      ward: { type: String },
      note: { type: String },
    },

    // Giá trị
    subtotal: { type: Number },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number },

    // Thanh toán
    paymentMethod: {
      type: String,
      enum: ["cod", "banking", "momo", "vnpay"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    // Trạng thái
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },

    // === ADMIN TRACKING ===
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    confirmedAt: { type: Date },

    shippedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    shippedAt: { type: Date },
    trackingNumber: { type: String },

    deliveredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deliveredAt: { type: Date },

    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
    adminNotes: { type: String },
    invoiceNumber: { type: String, unique: true },
    invoiceGeneratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    refundedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    refundedAt: { type: Date },
    refundAmount: { type: Number },
    refundReason: { type: String },
  },
  { timestamps: true },
);

// Tự động tạo invoice number
orderSchema.pre("save", async function (next) {
  if (!this.invoiceNumber && this.status === "confirmed") {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: new Date(year, date.getMonth(), 1) },
    });
    this.invoiceNumber = `INV-${year}${month}-${(count + 1).toString().padStart(4, "0")}`;
  }
  next();
});

export const Order = mongoose.model("Order", orderSchema);
