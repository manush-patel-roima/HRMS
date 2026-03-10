import { NavLink } from "react-router-dom";
import AuthService from "../services/auth/authService";

const Sidebar = () => {
  const role = AuthService.getRole();

  const common = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Achievements", path: "/social" },
    { label: "Org Chart", path: "/org-chart" },
    
  ];

  const employee = [
    { label: "Travels", path: "/travels" },
    { label: "Expenses", path: "/expenses" },
    { label: "Jobs", path: "/jobs" },
    { label: "Games", path: "/games" },
  ];

  const manager = [
    { label: "Team Travels", path: "/team-travels" },
    { label: "Team Expenses", path: "/team-expenses" }
  ];

  const hr = [
    { label: "Travel Management", path: "/hr/travels" },
    { label: "Expense Approvals", path: "/hr/expenses" },
    { label: "Games Config", path: "/hr/games-config" },
    { label: "Jobs", path: "/hr/jobs" },
    { label: "System Config", path: "/hr/config" }
  ];

  let menu = [...common];
  if (role === "EMPLOYEE") menu.push(...employee);
  if (role === "MANAGER") menu.push(...manager);
  if (role === "HR") menu.push(...hr);

  const setActiveClass = ({ isActive }) => (isActive ? 'bg-white text-slate-700' : ' hover:bg-teal-300 hover:text-slate-700');

  return (
    <div className="w-64 bg-gradient-to-b from-sky-900 to-sky-100 text-white font-bold tracking-wider text-lg p-4">
      {menu.map(m => (
        <NavLink
          key={m.path}
          to={m.path}
          className={({ isActive }) => 
            `block px-3 py-2 m-1 rounded ${setActiveClass({ isActive })}`
          }
        >
          {m.label}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;