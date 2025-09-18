import { Router } from "express";
import {
  loginUser,
  registerUser,
  resetPassword,
  sendResetPasswordOtp,
  refershAccessToken,
  logoutUser,
  SendverifyOtp,
  verifyEmail,
  isAuthenticated,
} from "../Controllers/auth.controller.js";
import { verifyJwt } from "../Middleware/auth.middleware.js";
import { getUserData } from "../Controllers/user.controller.js";

const router = Router();

// Public authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-reset-otp", sendResetPasswordOtp);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refershAccessToken);

// Apply authentication to all user routes
router.use(verifyJwt);

// Protected user routes 
router.post("/logout", logoutUser);
router.post("/send-otp", SendverifyOtp);
router.post("/verify-account", verifyEmail);
router.get("/isauth", isAuthenticated);
router.get("/data", getUserData); // Basic user info


export default router;