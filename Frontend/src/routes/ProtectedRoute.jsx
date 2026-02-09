import { Navigate } from "react-router-dom";
import AuthService from "../services/authService";

const ProtectedRoute = ({ children }) => {
  const token = AuthService.getToken();
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;