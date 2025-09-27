import express from "express";
import { verifyJwt } from "../Middleware/auth.middleware.js";
import { resolveTenant, tenantScoped } from "../Middleware/tenant.middleware.js";
import { createOrder, deleteOrder, getOrderById, getOrders, updateOrder } from "../Controllers/order.controller.js";
import { requirePermission } from "../Middleware/rbac.middleware.js";

const router = express.Router();


router.use(verifyJwt, resolveTenant, tenantScoped);

router.route("/")
  .get(requirePermission('orders', 'read'), getOrders)     
  .post(requirePermission('orders', 'create'), createOrder); 

router.route("/:id")
  .get(requirePermission('orders', 'read'), getOrderById)     
  .patch(requirePermission('orders', 'update'), updateOrder)  
  .delete(requirePermission('orders', 'delete'), deleteOrder); // Delete order


export default router;