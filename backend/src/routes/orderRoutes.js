import express from "express";
//import { createOrder } from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { createOrder, getMyOrders } from "../controllers/orderController.js";


const router = express.Router();

// Create order from cart
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
// Get logged in user's orders
export default router;
