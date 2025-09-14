// routes/dashboard.routes.js
import express from "express";
import { verifyJwt } from "../Middleware/auth.middleware.js";
import { resolveTenant, tenantScoped } from "../Middleware/tenant.middleware.js";
import { getDashboardData } from "../Controllers/dashboard.controller.js";

const router = express.Router();

router.get(
  "/dashboard",
  verifyJwt,
  resolveTenant,
  tenantScoped,
  getDashboardData
);


export default router;
