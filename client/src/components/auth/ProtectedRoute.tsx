import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  adminOnly = false,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If admin-only route and user is not admin, redirect to home
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
