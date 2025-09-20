import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // axios config
  axios.defaults.withCredentials = true;




  // Check auth on app load
useEffect(() => {
  const checkAuth = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/auth/isauth`);
      if (data.success) {
        setIsLoggedIn(true);
        setUserData(data.user);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (err) {
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setLoading(false);
      setIsAuthReady(true); // mark auth check done
    }
  };

  checkAuth();
}, []);

  // Fetch user data
  const fetchUserData = async (showToast = true) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/auth/data`);
      if (data.success) {
        setUserData(data.data);
        if (showToast) toast.success("User data fetched successfully");
        return data.data;
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      if (showToast) toast.error("Failed to fetch user data");
    }
  };

  // Login
  const loginUser = async (email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/v1/auth/login`, { email, password });
      if (data.success) {
        setIsLoggedIn(true);
        await fetchUserData(false);
        toast.success("Login successful!");
        return { success: true };
      }
    } catch (err) {
      console.error("Login error:", err);
      const message = err.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout
  const logoutUser = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/auth/logout`);
      setIsLoggedIn(false);
      setUserData(null);
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed");
    }
  };

  // Register
  const registerUser = async (userData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/v1/auth/register`, userData);
      if (data.success) {
        setIsLoggedIn(true);
        await fetchUserData(false);
        toast.success("Registration successful!");
        return { success: true };
      }
    } catch (err) {
      console.error("Registration error:", err);
      const message = err.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        loading,
        loginUser,
        logoutUser,
        registerUser,
        fetchUserData,
        isAuthReady,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
