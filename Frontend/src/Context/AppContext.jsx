import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

    const getUserData = async () => {
      try {
       const {data} = await axios.get(`${backendUrl}/api/users/data`, {
          withCredentials: true,
        });
        data.success = true;
        
        if (data.success) {
          setUserData(data.user);
        } else {
          console.error("Failed to fetch user data");
          toast.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error fetching user data");
        
      }
    }

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