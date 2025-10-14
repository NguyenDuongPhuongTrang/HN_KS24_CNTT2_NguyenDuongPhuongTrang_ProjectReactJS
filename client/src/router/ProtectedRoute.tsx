import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
