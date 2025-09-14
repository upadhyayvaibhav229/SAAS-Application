import { ROLE_PERMISSIONS } from "../config/role.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

export const requirePermission = (resource, action) => {
  return asyncHandler((req, res, next) => {
    const userRole = req.user.role;

    const userPermissions = ROLE_PERMISSIONS[userRole];
    
    if (!userPermissions || !userPermissions[resource] || !userPermissions[resource].includes(action)) {
      throw new ApiError(403, 
        `Access denied. ${userRole} role cannot ${action} ${resource}.`
      );
    }

    next();
  });
};