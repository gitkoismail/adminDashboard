import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useUserPresence from "../hooks/useUserPresence";
import { updateItem } from "../services/supabaseCrud";
import {
  FiUsers,
  FiClipboard,
  FiSmile,
  FiBriefcase,
  FiPackage,
  FiLogOut,
} from "react-icons/fi";

const Sidebar = () => {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "{}");
    } catch {
      return {};
    }
  });

  const status = useUserPresence();
  const navigate = useNavigate();

  const navStyle = ({ isActive, isPending }) => ({
    color: isActive ? "#6eaaeb" : isPending ? "#df3f3f" : "#0f172a",
  });

  const handleLogout = async () => {
    if (user?.id) {
      try {
        await updateItem("/staff", user.id, {
          status: "Offline",
        });
      } catch (err) {
        console.log("Logout status update failed:", err.message);
      }
    }

    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h3>Admin</h3>

      <ul>
        <li>
          <NavLink to="/dashboard" style={navStyle}>
            <span>Dashboard</span>
            <FiClipboard strokeWidth={1} className="sideSvg" />
          </NavLink>
        </li>

        <li>
          <NavLink to="/staff" style={navStyle}>
            <span>Staff</span>
            <FiSmile strokeWidth={1} className="sideSvg" />
          </NavLink>
        </li>

        <li>
          <NavLink to="/customers" style={navStyle}>
            <span>Customers</span>
            <FiUsers strokeWidth={1} className="sideSvg" />
          </NavLink>
        </li>

        <li>
          <NavLink to="/products" style={navStyle}>
            <span>Products</span>
            <FiPackage strokeWidth={1} className="sideSvg" />
          </NavLink>
        </li>

        <li>
          <NavLink to="/orders" style={navStyle}>
            <span>Orders</span>
            <FiBriefcase strokeWidth={1} className="sideSvg" />
          </NavLink>
        </li>
      </ul>

      <div className="navbar-user">
        <img
          onClick={() => navigate("/profile")}
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="avatar"
        />

        <p className={`status-badge status-${String(status).toLowerCase()}`}>
          Status: {status}
        </p>

        <button onClick={handleLogout}>
          <FiLogOut strokeWidth={1} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;