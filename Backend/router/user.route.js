import { Router } from "express";
import {
  isAuthenticated,
  loginUser,
  logoutUser,
  refershAccessToken,
  registerUser,
  resetPassword,
  sendResetPasswordOtp,
  SendverifyOtp,
  verifyEmail,
} from "../Controllers/auth.controller.js";
import { verifyJwt } from "../Middleware/auth.middleware.js";
import { getProfileDetails, getUserData, updateUser } from "../Controllers/user.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get('/me', verifyJwt, getCurrentUser);
router.post("/logout", logoutUser, verifyJwt);
router.post("/refresh-token", refershAccessToken);
router.post("/send-otp", verifyJwt, SendverifyOtp);
router.post("/verify-account", verifyJwt, verifyEmail);
router.get("/isauth", verifyJwt, isAuthenticated);
router.post("/send-reset-otp", sendResetPasswordOtp);
router.post("/reset-password", resetPassword);

router.get("/data", verifyJwt, getUserData);
router.get('/profile-details', verifyJwt, getProfileDetails);
router.post('/update-profile', verifyJwt, updateUser);

export default router;
