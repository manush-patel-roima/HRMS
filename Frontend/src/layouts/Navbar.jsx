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
    <div className="h-14 bg-sky-100 shadow flex items-center justify-between px-6">
      <h1 className="font-bold text-2xl text-slate-700">HRMS</h1>

      <div className="flex items-center gap-6 relative">
        <NotificationBell />

        <span className="text-slate-700 font-bold">{role}</span>

        <button
          onClick={handleLogout}
          className="text-red-800 font-bold rounded-full border-2 border-red px-2 py-1 bg-red-200 hover:bg-red-300"
        >
          Logout
        </button>
      </div>
    </div>

  );
};

export default Navbar;