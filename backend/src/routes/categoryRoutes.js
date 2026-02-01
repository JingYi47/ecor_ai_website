import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  getCategoryById,
  updateCategory,
  deleteCategory,
  restoreCategory,
  getProductsByCategory,
  getCategoriesWithCount,
  getFeaturedCategories,
  getCategoryWithHighlightProducts,
} from "../controllers/categoryController.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/with-count", getCategoriesWithCount);
router.get("/featured", getFeaturedCategories);
router.get("/:slug/highlight-products", getCategoryWithHighlightProducts);
router.patch("/:id/restore", isAuthenticated, isAdmin, restoreCategory);
router.get("/:slug/products", getProductsByCategory);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategoryById);
router.post("/", isAuthenticated, isAdmin, createCategory);
router.put("/:id", isAuthenticated, isAdmin, updateCategory);
router.delete("/:id", isAuthenticated, isAdmin, deleteCategory);

export default router;
