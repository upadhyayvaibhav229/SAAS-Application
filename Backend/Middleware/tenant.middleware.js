import { Tenant } from "../Models/tenant.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";


export const resolveTenant = asyncHandler(async (req, res, next) => {
  let tenantSlug;

  const host = req.get("host"); 
  if (!host.startsWith("localhost")) {
    const subdomain = host.split(".")[0];
    if (subdomain && subdomain !== "www" && subdomain !== "api") {
      tenantSlug = subdomain; 
    }
  }

  if (!tenantSlug && req.headers["x-tenant"]) {
    tenantSlug = req.headers["x-tenant"];
  }

  if (!tenantSlug && req.user && req.user.tenantId) {
    const tenant = await Tenant.findById(req.user.tenantId);
    req.tenant = tenant;
    return next();
  }

  if (!tenantSlug) {
    throw new ApiError(400, "Tenant identifier required");
  }

  const tenant = await Tenant.findOne({ slug: tenantSlug });
  console.log("tenantSlug from request:", tenantSlug);

  if (!tenant) {
    throw new ApiError(404, "Tenant not found");
  }

  req.tenant = tenant;
  req.tenantId = tenant._id; 
  next();
});

export const tenantScoped = (req, res, next) => {
  if (!req.tenant) {
    throw new ApiError(400, "Tenant context required");
  }

  req.tenantId = req.tenant._id;
  next();
};

