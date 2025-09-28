import { Router } from "express";
import { verifyJwt } from "../Middleware/auth.middleware.js";
import { requirePermission } from "../Middleware/rbac.middleware.js";
import { resolveTenant, tenantScoped } from "../Middleware/tenant.middleware.js";
import { createItem, deleteItem, getAllItems, getItemById, updateItem } from "../Controllers/item.controller.js";

const router = Router();
router.use(verifyJwt, resolveTenant, tenantScoped);

router.route("/")
    .get(requirePermission('items', 'read'), getAllItems)     
    .post(requirePermission('items', 'create'), createItem); 

router.route("/:id")
    .get(requirePermission('items', 'read'), getItemById)     
    .patch(requirePermission('items', 'update'), updateItem)  
    .delete(requirePermission('items', 'delete'), deleteItem);

export default router;