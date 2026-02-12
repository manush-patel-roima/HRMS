import { NavLink } from "react-router-dom";
import AuthService from "../services/auth/authService";

const Sidebar = () => {
  const role = AuthService.getRole();

  const common = [
    { label: "Dashboard", path: "/" },
    { label: "Achievements", path: "/achievements" },
    { label: "Games", path: "/games" },
    { label: "Org Chart", path: "/org-chart" },
    { label: "Jobs", path: "/jobs" }
  ];

  const employee = [
    { label: "Travels", path: "/travels" },
    { label: "Expenses", path: "/expenses" }
  ];

  const manager = [
    { label: "Team Travels", path: "/team-travels" },
    { label: "Team Expenses", path: "/team-expenses" }
  ];

  const hr = [
    { label: "Travel Management", path: "/hr/travels" },
    { label: "Expense Approvals", path: "/hr/expenses" },
    { label: "Games Config", path: "/hr/games" },
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