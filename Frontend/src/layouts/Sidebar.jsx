import { NavLink } from "react-router-dom";
import AuthService from "../services/auth/authService";

const Sidebar = () => {
  const role = AuthService.getRole();

  const common = [
    { label: "Dashboard", path: "/" },
    { label: "Achievements", path: "/achievements" }, 
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

  return (
    <div className="w-64 bg-slate-900 text-white p-4">
      {menu.map(m => (
        <NavLink
          key={m.path}
          to={m.path}
          className="block px-3 py-2 rounded hover:bg-slate-700"
        >
          {m.label}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;