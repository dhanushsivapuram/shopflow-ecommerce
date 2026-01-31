import express from "express";
import { addToCart, getCart } from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected cart routes
router.post("/", protect, addToCart);
router.get("/", protect, getCart);

export default router;
