import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../Controllers/user.controller.js";
import { verifyJwt } from "../Middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login",loginUser);
router.post('/logout', logoutUser, verifyJwt)
  

export default router;