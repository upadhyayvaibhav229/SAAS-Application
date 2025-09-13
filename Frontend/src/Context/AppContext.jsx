import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // ✅ Rehydrate accessToken from localStorage on first render
const [accessToken, setAccessTokenState] = useState(() => {
  return localStorage.getItem("accessToken") || null;
});

  // ✅ Sync accessToken to localStorage when changed
  const setAccessToken = (token) => {
  setAccessTokenState(token);
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

  const getAuthState = async (showToast = true) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/users/isauth`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.success) {
        setIsLoggedIn(true);
        setUserData(data.user);
        if (showToast) toast.success("User is authenticated");
      }
    } catch (error) {
      console.error("Error checking authentication state:", error);
      if (showToast) toast.error("Failed to check authentication state");
    }
  };

  const getUserData = async (showToast = true) => {
    try {
      if (!accessToken) {
        console.warn("No access token available");
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/v1/users/data`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.success) {
        setUserData(data.user);
        if (showToast) toast.success("User data fetched successfully");
      } else {
        if (showToast) toast.error(data.message);
      }
    } catch (error) {
      if (showToast) toast.error("Failed to fetch user data");
    }
  };

 const loadUserProfileData = async () => {
  try {
    const {data} = await axios.get(`${backendUrl}/api/v1/user/profile-details`);

    if (data.success) {
      setUserData(data.user);
      console.log(data.user);
      
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log('Error loading user profile data:', error);
  }
 }

useEffect(() => {
  const checkAuth = async () => {
    if (accessToken) {
      await getAuthState(false);
      await getUserData(false);
    }
    setLoading(false); // done checking
  };

  checkAuth();
}, [accessToken]);

useEffect(()=> {
  if (accessToken) {
    loadUserProfileData()
  }else{
    setUserData(null)
  }
}, [accessToken])

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    accessToken,
    setAccessToken,
    getUserData,
    loading,
    loadUserProfileData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
