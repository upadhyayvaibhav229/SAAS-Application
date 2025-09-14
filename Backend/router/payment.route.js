// routes/payment.routes.js

import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { resolveTenant, tenantScoped } from "../middlewares/tenant.middleware.js";
import { requirePermission } from "../Middleware/rbac.middleware.js";
import { createPayment, deletePayment, getPayment, getPayments, updatePayment } from "../Controllers/payment.controller.js";

const router = express.Router();

// Secure all routes with JWT + tenant + RBAC
router.use(verifyJWT, resolveTenant, tenantScoped);

// Payment routes
router.route("/")
  .post(requirePermission("admin", "manager"), createPayment)   
  .get(requirePermission("admin", "manager", "staff"), getPayments); 

router.route("/:id")
  .get(requirePermission("admin", "manager", "staff"), getPayment)   
  .put(requirePermission("admin", "manager"), updatePayment)         
  .delete(requirePermission("admin"), deletePayment);                

export default router;
