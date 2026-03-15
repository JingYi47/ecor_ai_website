import express from "express";
import {
  listProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  deleteProductImage,
  getNewArrivals,
  searchProducts,
  getDiscountedProducts,
  getFeaturedProducts,
  hideProduct,
  showProduct,
  getProductImages,
  getProductByColor,
  addColorImage,
  restoreProduct,
  updateColorStock,
} from "../controllers/productController.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", listProducts);
router.get("/new-arrivals", getNewArrivals);
router.get("/search", searchProducts);
router.get("/on-sale", getDiscountedProducts);
router.get("/featured", getFeaturedProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);
router.post("/", isAuthenticated, isAdmin, createProduct);
router.put("/:id", isAuthenticated, isAdmin, updateProduct);
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);
router.put("/:id/disable", hideProduct);
router.put("/:id/enable", showProduct);
router.patch("/:id/restore", isAuthenticated, isAdmin, restoreProduct);

// router.post("/:id/images", upload.single("image"), (req, res) => {
//   res.json({
//     success: true,
//     file: !!req.file,
//   });
// });
router.post(
  "/:id/images",
  isAuthenticated,
  isAdmin,
  upload.single("image"),
  addProductImage,
);
router.get("/:id/images", getProductImages);
router.get("/:id/color/:colorName", getProductByColor);
router.put(
  "/:id/color/:colorName/stock",
  isAuthenticated,
  isAdmin,
  updateColorStock,
);
router.post(
  "/:id/color/:colorName/image",
  isAuthenticated,
  isAdmin,
  upload.single("image"),
  addColorImage,
);

router.delete("/:id/images", isAuthenticated, isAdmin, deleteProductImage);

export default router;
