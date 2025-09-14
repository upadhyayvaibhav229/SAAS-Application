import { User } from "../Models/user.models.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { ROLE_PERMISSIONS } from "../config/role.js"; // make sure this has admin, manager, etc.

const getUserData = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized");

  const user = await User.findById(req.user._id)
    .select("-password -refreshToken")
    .populate("tenantId", "name slug");

  if (!user) throw new ApiError(404, "User not found");

  // Compute permissions
  const permissions = ROLE_PERMISSIONS[user.role] || {};

  return res.status(200).json(
    new ApiResponse(200, {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isAccountVerified: user.isAccountVerified,
      tenant: user.tenantId
        ? { id: user.tenantId._id, name: user.tenantId.name, slug: user.tenantId.slug }
        : null,
      permissions, // ✅ add permissions here
    }, "User data fetched successfully")
  );
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ tenantId: req.tenantId })
    .select("-password -refreshToken")
    .populate("tenantId", "name slug");

  return res.status(200).json(
    new ApiResponse(200, users, "Users fetched successfully")
  );
});


const createUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  if (!email || !password || !firstName || !lastName || !role) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({
    email,
    tenantId: req.tenantId,
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists in this tenant");
  }

  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    role,
    tenantId: req.tenantId,
  });

  const userWithoutPassword = await User.findById(user._id)
    .select("-password -refreshToken")
    .populate("tenantId", "name slug");

  return res.status(201).json(
    new ApiResponse(201, userWithoutPassword, "User created successfully")
  );
});


const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    throw new ApiError(400, "Role is required");
  }

  if (id === req.user._id.toString()) {
    throw new ApiError(403, "You cannot change your own role");
  }

  const user = await User.findOneAndUpdate(
    { _id: id, tenantId: req.tenantId },
    { role },
    { new: true }
  )
    .select("-password -refreshToken")
    .populate("tenantId", "name slug");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User role updated successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (id === req.user._id.toString()) {
    throw new ApiError(403, "You cannot delete yourself");
  }

  const userToDelete = await User.findOne({ _id: id, tenantId: req.tenantId });
  if (!userToDelete) {
    throw new ApiError(404, "User not found");
  }

  if (userToDelete.role === "admin") {
    const adminCount = await User.countDocuments({
      tenantId: req.tenantId,
      role: "admin",
    });

    if (adminCount <= 1) {
      throw new ApiError(403, "Cannot delete the last admin");
    }
  }

  await User.findOneAndDelete({ _id: id, tenantId: req.tenantId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

export { getUserData, getUsers, createUser, updateUserRole, deleteUser };
