import { Router } from "express";
import { verifyJwt } from "../Middleware/auth.middleware.js";
import { resolveTenant, tenantScoped } from "../Middleware/tenant.middleware.js";
import { authorizeRoles } from "../Middleware/rolebase.middleware.js";

import { 
  getUserData, 
  getUsers, 
  createUser, 
  updateUserRole, 
  deleteUser 
} from "../Controllers/user.controller.js";

const router = Router();

router.use(verifyJwt);


router.use("/admin", resolveTenant, tenantScoped);

router.get("/admin/dashboard", authorizeRoles('admin'), (req, res) => {
  res.status(200).json({ message: "Welcome to the Admin Dashboard" });
});

router.get("/admin/users", authorizeRoles('admin'), getUsers);
router.post("/admin/users", authorizeRoles('admin'), createUser);
router.patch("/admin/users/:id/role", authorizeRoles('admin'), updateUserRole);
router.delete("/admin/users/:id", authorizeRoles('admin'), deleteUser);

export default router;