import { Router } from "express";
import {
  loginUser,
  registerUser,
  resetPassword,
  sendResetPasswordOtp,
  refershAccessToken,
} from "../Controllers/auth.controller.js";

const router = Router();

// Public authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-reset-otp", sendResetPasswordOtp);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refershAccessToken);

export default router;