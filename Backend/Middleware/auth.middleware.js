import jwt from "jsonwebtoken";
import { User } from "../Models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

// ✅ Verifies JWT and attaches user info to req
export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      req.user = null; // Allow public access if route doesn't require auth
      return next();
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken || !decodedToken._id) {
      throw new ApiError(401, "Invalid or expired token");
    }

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;

    // Optional shortcut: inject userId in body
    req.body = req.body || {};
    req.body.userId = decodedToken._id;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    req.user = null;
    next(); // Allow next middleware/route to decide (can return 401)
  }
});
