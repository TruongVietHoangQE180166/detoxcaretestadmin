import React from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

const PrivateRoute = ({ children }: { children: React.JSX.Element }) => {
  const user = useUserStore((state) => state.user);
  const token = sessionStorage.getItem("accessToken");

  // Check if user is authenticated
  const isAuthenticated = token && user;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;