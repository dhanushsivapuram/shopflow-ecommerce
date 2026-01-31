import express from "express";
import { registerUser, loginUser } from "../controllers/authcontroller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// protected route
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

export default router;
