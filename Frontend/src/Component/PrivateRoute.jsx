import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AppContext);

  if (loading) return <div>Loading...</div>; // show spinner or loader

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
