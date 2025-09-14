import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomerById,
  updateCustomer
} from "../Controllers/customer.controller.js";
import { verifyJwt } from "../Middleware/auth.middleware.js";
import { resolveTenant, tenantScoped } from "../Middleware/tenant.middleware.js";
import { requirePermission } from "../Middleware/rbac.middleware.js";

const router = express.Router();

router.use(verifyJwt, resolveTenant, tenantScoped);

router.route("/")
  .get(requirePermission('customers', 'read'), getCustomer)
  .post(requirePermission('customers', 'create'), createCustomer);

router.route("/:id")
  .get(requirePermission('customers', 'read'), getCustomerById)
  .patch(requirePermission('customers', 'update'), updateCustomer)
  .delete(requirePermission('customers', 'delete'), deleteCustomer);

export default router;
