import express from "express";
import {
  createOrUpdateReview,
  getReviewsByProduct,
  deleteReview,
} from "../controllers/reviewController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/", isAuthenticated, createOrUpdateReview);
router.get("/product/:productId", getReviewsByProduct);
router.delete("/:id", isAuthenticated, deleteReview);

export default router;
