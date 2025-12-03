// src/routes/authRoutes.js
import express from "express";
import { register, login, forgotPassword, resetPassword,  getProfile  } from "../controllers/authController.js";
import { protect } from "../Middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// NEW:
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/profile", protect, getProfile); 

export default router;
