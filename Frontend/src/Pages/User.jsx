// components/User.jsx
import React, { useState, useEffect, useContext } from "react";
// import { useUserService } from "../services/userService";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import { useUserService } from "../services/userService";

const roles = ["admin", "manager", "staff", "accountant", "viewer"];

const User = () => {
  const { userData } = useContext(AppContext);
  const userService = useUserService();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "staff",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        await userService.updateUser(editUser._id, formData);
        toast.success("User updated successfully");
      } else {
        await userService.createUser(formData);
        toast.success("User created successfully");
      }
      setShowForm(false);
      setEditUser(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "staff",
      });
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: "",
      role: user.role || "staff",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await userService.deleteUser(id);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );

  const canCreate = userData?.permissions?.users?.includes("create");
  const canUpdate = userData?.permissions?.users?.includes("update");
  const canDelete = userData?.permissions?.users?.includes("delete");

  return (
    <div className="bg-gray-800 h-screen rounded-lg shadow-md p-4 md:p-6 overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-2">
        <h2 className="text-2xl font-bold text-white">Users</h2>
        {canCreate && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            {editUser ? "Edit User" : "Add New User"}
          </button>
        )}
      </div>

      {/* Inline Create/Edit Form */}
      {showForm && canCreate && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-500 p-4 md:p-6 rounded mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="p-2 rounded w-full text-black"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="p-2 rounded w-full text-black"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="p-2 rounded w-full text-black"
              required
            />
            {!editUser && (
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="p-2 rounded w-full text-black"
                required
              />
            )}
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="p-2 rounded w-full text-black"
              required
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col md:flex-row justify-end mt-4 gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditUser(null);
                setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  password: "",
                  role: "staff",
                });
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded w-full md:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full md:w-auto"
            >
              {editUser ? "Update" : "Create"}
            </button>
          </div>
        </form>
      )}

      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 rounded-lg text-sm md:text-base">
            <thead>
              <tr className="bg-gray-600">
                <th className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-600 transition-colors">
                  <td className="px-4 py-2 whitespace-nowrap text-white">{user.firstName} {user.lastName}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-300">{user.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-300">{user.role}</td>
                  <td className="px-4 py-2 whitespace-nowrap flex flex-col md:flex-row gap-2">
                    {canUpdate && (
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default User;
