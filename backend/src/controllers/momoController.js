import crypto from "crypto";
import { Checkout } from "../models/checkoutModel.js";
import { createOrderFromCheckout } from "./orderController.js";

export const createMomoPayment = async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    checkout.paymentMethod = "MOMO";
    // checkout.paymentAttempts += 1;
    checkout.paymentAttempts = (checkout.paymentAttempts || 0) + 1;

    checkout.lastPaymentAt = new Date();
    await checkout.save();

    return res.json({
      success: true,
      payUrl: "http://localhost:5173/payment/momo/simulator",
      checkoutId: checkout._id,
    });
  } catch (err) {
    console.error("CREATE MOMO ERROR:", err);
    res.status(500).json({ message: "Create MoMo payment failed" });
  }
};

export const ipnCallback = async (req, res) => {
  console.log("📩 MOMO IPN:", req.body);
  return res.status(204).end();
};

export const handleCallback = async (req, res) => {
  try {
    console.log("MOMO RETURN QUERY:", req.query);

    const { checkoutId, resultCode } = req.query;

    if (!checkoutId) {
      return res.status(400).json({ message: "Missing checkoutId" });
    }

    const checkout = await Checkout.findById(checkoutId);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    // if (resultCode === "0") {
    //   checkout.status = "paid";
    //   checkout.lastPaymentAt = new Date();
    // } else {
    //   checkout.status = "cancelled";
    // }

    // await checkout.save();

    if (resultCode === "0") {
      // chống tạo order trùng
      if (checkout.status !== "paid") {
        checkout.status = "paid";
        checkout.lastPaymentAt = new Date();
        checkout.paymentMethod = "MOMO";
        await checkout.save();

        await createOrderFromCheckout(checkout._id);
      }
    } else {
      checkout.status = "cancelled";
      await checkout.save();
    }

    return res.json({
      message: "MoMo return handled",
      status: checkout.status,
      checkoutId: checkout._id,
    });
  } catch (error) {
    console.error("MOMO RETURN ERROR:", error);
    res.status(500).json({ message: "Handle return failed" });
  }
};

// export const simulateCallback = async (req, res) => {
//   try {
//     const { checkoutId, success = true } = req.body;

//     const checkout = await Checkout.findById(checkoutId);
//     if (!checkout) {
//       return res.status(404).json({ message: "Checkout not found" });
//     }

//     checkout.status = success ? "paid" : "cancelled";
//     checkout.paymentMethod = "MOMO";
//     await checkout.save();

//     return res.json({
//       success: true,
//       message: "MoMo payment simulated",
//       checkout,
//     });
//   } catch (err) {
//     console.error("SIMULATE MOMO ERROR:", err);
//     res.status(500).json({ message: "Simulation failed" });
//   }
// };

export const simulateCallback = async (req, res) => {
  try {
    const { checkoutId, success = true } = req.body;

    const checkout = await Checkout.findById(checkoutId);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (success) {
      // chống duplicate order
      if (checkout.status !== "paid") {
        checkout.status = "paid";
        checkout.paymentMethod = "MOMO";
        checkout.lastPaymentAt = new Date();
        await checkout.save();

        await createOrderFromCheckout(checkout._id);
      }
    } else {
      checkout.status = "cancelled";
      await checkout.save();
    }

    return res.json({
      success: true,
      message: "MoMo payment simulated",
      checkout,
    });
  } catch (err) {
    console.error("SIMULATE MOMO ERROR:", err);
    res.status(500).json({ message: "Simulation failed" });
  }
};
