import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth/authService";
import NotificationBell from "../components/NotificationBell"


const Navbar = () => {
  const role = AuthService.getRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  }

  return (
    <div className="h-14 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-bold text-blue-600">HRMS</h1>

      <div className="flex items-center gap-6 relative">
        <NotificationBell />

        <span className="text-gray-600">{role}</span>

        <button
          onClick={handleLogout}
          className="text-red-600 font-medium"
        >
          Logout
        </button>
      </div>
    </div>

  );
};

export default Navbar;