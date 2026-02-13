import { useNavigate } from "react-router-dom";
import { useEffect,useState } from 'react'; 
import AuthService from "../services/auth/authService";
import WebSocketService from "../services/websocket/webSocketService";


const Navbar = () => {
  const role = AuthService.getRole();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    WebSocketService.connect((message) => {
      setNotifications(prev => [...prev, message]);
    });

    return () => WebSocketService.disconnect();
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  }

  return (
    // <div className="h-14 bg-white shadow flex items-center justify-between px-6">
    //   <h1 className="text-xl font-bold text-blue-600">HRMS</h1>

    //   <div className="flex items-center gap-4">
    //     <span className="text-gray-600">{role}</span>

    //     <button className="relative">
    //       🔔
    //     </button>

    //     <button
    //       onClick={handleLogout}
    //       className="text-red-500 font-medium"
    //     >
    //       Logout
    //     </button>
    //   </div>
    // </div>



    <div className="h-14 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-bold text-blue-600">HRMS</h1>

      <div className="flex items-center gap-6 relative">
        <div className="relative">
          🔔
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {notifications.length}
            </span>
          )}

          {notifications.length > 0 && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg w-64 p-3 rounded z-50">
              {notifications.map((n, i) => (
                <p key={i} className="text-sm border-b py-1">
                  {n}
                </p>
              ))}
            </div>
          )}
        </div>

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