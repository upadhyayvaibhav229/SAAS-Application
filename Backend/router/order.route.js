import express from "express";
import { verifyJwt } from "../Middleware/auth.middleware.js";
import { resolveTenant, tenantScoped } from "../Middleware/tenant.middleware.js";
import { createOrder, deleteOrder, getOrderById, getOrders, updateOrder } from "../Controllers/order.controller.js";
import { requirePermission } from "../Middleware/rbac.middleware.js";

const router = express.Router();

// Apply these middlewares to every route in this file
router.use(verifyJwt, resolveTenant, tenantScoped);

router.route("/")
  .get(requirePermission('orders', 'read'), getOrders)     // View all orders
  .post(requirePermission('orders', 'create'), createOrder); // Create new order

router.route("/:id")
  .get(requirePermission('orders', 'read'), getOrderById)     // View specific order
  .patch(requirePermission('orders', 'update'), updateOrder)  // Update order
  .delete(requirePermission('orders', 'delete'), deleteOrder); // Delete order


export default router;