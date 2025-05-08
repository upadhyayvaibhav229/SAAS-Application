import { Router } from "express";
import {
  isAuthenticated,
  loginUser,
  logoutUser,
  refershAccessToken,
  registerUser,
  SendverifyOtp,
  verifyEmail,
} from "../Controllers/user.controller.js";
import { verifyJwt } from "../Middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get('/me', verifyJwt, getCurrentUser);
router.post("/logout", logoutUser, verifyJwt);
router.post('/refresh-token', refershAccessToken);
router.post("/send-otp",  verifyJwt, SendverifyOtp);
router.post("/verify-account", verifyJwt,verifyEmail);
router.post("/isauth", verifyJwt,isAuthenticated);


export default router;
