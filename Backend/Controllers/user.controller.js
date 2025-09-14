import { User } from "../Models/user.models.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// @desc    Get current user's data
// @route   GET /api/users/data
// @access  Private
const getUserData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -refreshToken");
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAccountVerified: user.isAccountVerified,
      phone: user.phone,
      location: user.location,
      role: user.role
    }, "User data fetched successfully")
  );
});

// @desc    Get all users for the current tenant (Admin/Owner only)
// @route   GET /api/users/admin/users
// @access  Private (Admin, Owner)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ tenantId: req.tenantId }).select("-password -refreshToken");
  
  return res.status(200).json(
    new ApiResponse(200, users, "Users fetched successfully")
  );
});

// @desc    Create a new user (Admin/Owner only)
// @route   POST /api/users/admin/users
// @access  Private (Admin, Owner)
const createUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  if (!email || !password || !firstName || !lastName || !role) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ 
    email, 
    tenantId: req.tenantId 
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
    tenantId: req.tenantId
  });

  const userWithoutPassword = await User.findById(user._id).select("-password -refreshToken");

  return res.status(201).json(
    new ApiResponse(201, userWithoutPassword, "User created successfully")
  );
});

// @desc    Update user role (Owner only)
// @route   PATCH /api/users/admin/users/:id/role
// @access  Private (Owner only)
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
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User role updated successfully")
  );
});

// @desc    Delete a user (Owner only)
// @route   DELETE /api/users/admin/users/:id
// @access  Private (Owner only)
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (id === req.user._id.toString()) {
    throw new ApiError(403, "You cannot delete yourself");
  }

  const userToDelete = await User.findOne({ _id: id, tenantId: req.tenantId });
  if (userToDelete.role === 'owner') {
    const ownerCount = await User.countDocuments({ 
      tenantId: req.tenantId, 
      role: 'owner' 
    });
    
    if (ownerCount <= 1) {
      throw new ApiError(403, "Cannot delete the last owner");
    }
  }

  const user = await User.findOneAndDelete({ _id: id, tenantId: req.tenantId });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, null, "User deleted successfully")
  );
});

// Export all functions
export {
  getUserData,
  getUsers,
  createUser,
  updateUserRole,
  deleteUser
};