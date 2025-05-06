import { User } from "../Models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"


export const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            req.user = null;  // ✅ Allow token-less requests (for logout)
            return next();
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decodedToken) {
            req.body.userId = decodedToken._id;  // Correctly assign _id to req.userId
        } else {
            throw new ApiError(401, "Invalid Access Token");
        }

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        req.user = null;  // ✅ Prevent breaking logout
        next();
    }
});


