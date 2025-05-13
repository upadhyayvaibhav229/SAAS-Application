import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
 const token = localStorage.getItem("accessToken");
 console.log("Access Token:", token);
 

  const getAuthState = async () => {
   try {
     const {data} = await axios.get(`${backendUrl}/api/auth/isauth`)
     if (data.success) {
       setIsLoggedIn(true);
       setUserData(data.user); 
       toast.success("User is authenticated");
     }
   } catch (error) {
     console.error("Error checking authentication state:", error);
     toast.error("Failed to check authentication state");
    
   }
}
  
  const getUserData = async () => {
    try {
      if (!token) {
        console.warn("No access token available");
        return;
      }

      const { data } = await axios.get(`${backendUrl}/api/users/data`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      console.log(data)

    

      if (data.success) {
        setUserData(data.user); 
        toast.success("User data fetched successfully");
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    }
  };

  useEffect(() => {
   getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
