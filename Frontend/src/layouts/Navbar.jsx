// import { useNavigate } from "react-router-dom";
// import AuthService from "../services/auth/authService";
// import NotificationBell from "../components/NotificationBell"

// const Navbar = () => {
//   const role = AuthService.getRole();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     AuthService.logout();
//     navigate("/login");
//   }

//   return (
//     <div className="h-14 bg-sky-100 shadow flex items-center justify-between px-6">
//       <h1 className="font-bold text-2xl text-slate-700">HRMS</h1>

//       <div className="flex items-center gap-6 relative">
//         <NotificationBell />

//         <span className="text-slate-700 font-bold">{role}</span>

//         <button
//           onClick={handleLogout}
//           className="text-red-800 font-bold rounded-full border-2 border-red px-2 py-1 bg-red-200 hover:bg-red-300"
//         >
//           Logout
//         </button>
//       </div>
//     </div>

//   );
// };

// export default Navbar;

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth/authService";
import NotificationBell from "../components/NotificationBell";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar = () => {
  const [details, setDetails] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const role = details?.role;
  const name = details?.fullName;
  const designation = details?.designation;

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  useEffect(() => {
    AuthService.getMyDetails().then((res) => setDetails(res.data));

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-14 bg-sky-100 shadow flex items-center justify-between px-6 relative z-50">
      <h1 className="font-bold text-2xl text-slate-700">HRMS</h1>

      <div className="flex items-center gap-6">
        <NotificationBell />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-700 text-white font-bold hover:bg-slate-800 transition-colors focus:outline-none"
          >
            {name ? name.charAt(0).toUpperCase() : "No Name"}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-slate-200 z-50">
              <div className="px-4 py-2 flex flex-col items-center">
                <p className="text-lg font-bold text-slate-800">
                  {name || "No Name"}
                </p>
                <p className="text-m text-slate-600">
                  {designation || "No Designation"}
                </p>
              </div>

              <hr className="border-slate-100" />

              <div className="px-4 py-2 flex gap-2">
                <AccountBoxIcon />
                <p className="text-m text-slate-600">{role || "No Role"}</p>
              </div>

              <hr className="border-slate-100" />

              <div className="flex gap-2 w-full px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 font-semibold transition-colors">
                <LogoutIcon />
                <button onClick={handleLogout} className="text-m">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
