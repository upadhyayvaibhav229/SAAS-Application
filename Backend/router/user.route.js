import { Router } from "express";
import {
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
router.post("/logout", logoutUser, verifyJwt);
router.post('/refresh-token', refershAccessToken);
router.post("/send-otp",  verifyJwt, SendverifyOtp);
router.post("/verify-account", verifyJwt,verifyEmail);


export default router;
