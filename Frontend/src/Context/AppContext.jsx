import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // ✅ Rehydrate accessToken from localStorage on first render
  const [accessToken, setAccessTokenState] = useState(() => {
    const storedToken = localStorage.getItem("accessToken");
    return storedToken ? JSON.parse(storedToken) : null;
  });

  // ✅ Sync accessToken to localStorage when changed
  const setAccessToken = (token) => {
    setAccessTokenState(token);
    if (token) {
      localStorage.setItem("accessToken", JSON.stringify(token));
    } else {
      localStorage.removeItem("accessToken");
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/isauth`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.success) {
        setIsLoggedIn(true);
        setUserData(data.user);
        toast.success("User is authenticated");
      }
    } catch (error) {
      console.error("Error checking authentication state:", error);
      toast.error("Failed to check authentication state");
    }
  };

  const getUserData = async () => {
    try {
      if (!accessToken) {
        console.warn("No access token available");
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/users/data`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.success) {
        setUserData(data.user);
        toast.success("User data fetched successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch user data");
    }
  };

  useEffect(() => {
    if (accessToken) {
      getAuthState();
    }
  }, [accessToken]);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    accessToken,
    setAccessToken,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
