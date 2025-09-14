// services/useUserService.js
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";

export const useUserService = () => {
  const { backendUrl } = useContext(AppContext);

  // Fetch all users (admin only)
  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/users/admin/users`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  };

  // Fetch single user by ID
  const getUserById = async (id) => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/users/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
  };

  // Create a new user (admin only)
  const createUser = async (userData) => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/users/admin/users`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create user");
    }
  };

  // Update user role (owner only)
  const updateUserRole = async (id, role) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/api/v1/users/admin/users/${id}/role`,
        { role }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update user role");
    }
  };

  // Delete user (owner only)
  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/v1/users/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return {
    getAllUsers,
    getUserById,
    createUser,
    updateUserRole,
    deleteUser,
  };
};
