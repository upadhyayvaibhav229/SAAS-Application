import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { useEffect } from "react";
import { toast } from "react-toastify";

const PrivateRoute = () => {
  const { isLoggedIn, loading } = useContext(AppContext);

  useEffect(()=>{
    if (!loading && !isLoggedIn) {
      toast.info("Please login or register to access the dashbaord")
    }
  },[loading, isLoggedIn]);

  if (loading) return <div>Loading...</div>

  return isLoggedIn ? <Outlet /> : <Navigate to={'/login'} replace/>
};

export default PrivateRoute;
