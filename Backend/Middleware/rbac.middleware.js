import { ROLE_PERMISSIONS } from "../config/role.js";
import { asyncHandler } from "../utils/asynchandler.js";

export const requirePermission = (resource, action) => {
  return asyncHandler((req, res, next) => {
    const userRole = req.user.role;
    const userPermissions = ROLE_PERMISSIONS[userRole];

    if (!userPermissions || !userPermissions[resource]?.includes(action)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${userRole} role cannot ${action} ${resource}.`,
        errors: []
      });
    }

    next();
  });
};
