import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.JSX.Element }) => {
  // Check if user is authenticated by looking directly at sessionStorage
  // This avoids timing issues with store rehydration
  const token = sessionStorage.getItem("accessToken");
  const userId = sessionStorage.getItem("userId");
  const userName = sessionStorage.getItem("userName");  // This is stored as username from the API
  const email = sessionStorage.getItem("email");
  const role = sessionStorage.getItem("role");
  
  // Must have all required authentication data to be considered authenticated
  const isAuthenticated = token && userId && userName && email && role;

  // If authenticated, redirect to dashboard instead of showing login page
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;