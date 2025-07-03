import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { auth, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!auth) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(auth.user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
