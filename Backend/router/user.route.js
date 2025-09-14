import { Router } from "express";
import { verifyJwt } from "../Middleware/auth.middleware.js";
import { resolveTenant, tenantScoped } from "../Middleware/tenant.middleware.js";
import { authorizeRoles } from "../Middleware/rolebase.middleware.js";

import {
  logoutUser,
  SendverifyOtp,
  verifyEmail,
  isAuthenticated,
} from "../Controllers/auth.controller.js";

import { 
  getUserData, 
  getUsers, 
  createUser, 
  updateUserRole, 
  deleteUser 
} from "../Controllers/user.controller.js";

const router = Router();

// Apply authentication to all user routes
router.use(verifyJwt);

// Protected user routes (no admin role needed)
router.post("/logout", logoutUser);
router.post("/send-otp", SendverifyOtp);
router.post("/verify-account", verifyEmail);
router.get("/isauth", isAuthenticated);
router.get("/data", getUserData); // Basic user info

// Apply tenant middleware to admin routes only
router.use("/admin", resolveTenant, tenantScoped);

// Admin-only routes
router.get("/admin/dashboard", authorizeRoles('admin', 'owner'), (req, res) => {
  res.status(200).json({ message: "Welcome to the Admin Dashboard" });
});

router.get("/admin/users", authorizeRoles('admin', 'owner'), getUsers);
router.post("/admin/users", authorizeRoles('admin', 'owner'), createUser);
router.patch("/admin/users/:id/role", authorizeRoles('owner'), updateUserRole);
router.delete("/admin/users/:id", authorizeRoles('owner'), deleteUser);

export default router;