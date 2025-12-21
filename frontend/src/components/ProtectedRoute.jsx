import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../context/useAuthStore";

const ProtectedRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return null;

  return authUser ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
