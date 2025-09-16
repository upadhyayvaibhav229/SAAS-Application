import React, { useState, useContext, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home, Users, Package, ShoppingCart, FileText,
  CreditCard, Settings, User, LogOut, Menu, X
} from "lucide-react";
import { AppContext } from "../Context/AppContext";

const Sidebar = () => {
  const { userData, isLoggedIn, logoutUser } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // show sidebar
  const hasPermission = (resource) => {
    const userRole = userData?.role;
    const userPermissions = ROLE_PERMISSIONS[userRole] || {};

    return userPermissions[resource]?.includes('read');
  };


  // Links dynamically depend on userData and role
  const links = [
    { to: "/", label: "Dashboard", icon: <Home size={18} /> },
    { to: "/customers", label: "Customers", icon: <Users size={18} /> },
    { to: "/items", label: "Items", icon: <Package size={18} /> },
    { to: "/orders", label: "Orders", icon: <ShoppingCart size={18} /> },
    { to: "/invoices", label: "Invoices", icon: <FileText size={18} /> },
    { to: "/payments", label: "Payments", icon: <CreditCard size={18} /> },
    { to: "/users", label: "User", icon: <User size={18} /> },
  ];

  if (["admin", "owner"].includes(userData?.role)) {
    links.push({ to: "/settings", label: "Settings", icon: <Settings size={18} /> });
  }

  return (
    <>
      {/* Sidebar */}
      {isLoggedIn && (
        <div
          className={`fixed md:relative top-0 left-0 h-full bg-slate-900 text-white p-4 transform transition-all duration-300 z-50
    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0 ${isCollapsed ? "md:w-16" : "md:w-64"}`}
        >
          <h2 className={`text-xl font-bold mb-6 ${isCollapsed ? "md:hidden" : "md:block"}`}>
            ERP System
          </h2>

          <nav className="flex flex-col space-y-2">
            {links.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md transition
            ${isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "hover:bg-slate-800 hover:text-indigo-300"
                  }
            ${isCollapsed ? "md:justify-center" : ""}`
                }
                onClick={() => setIsOpen(false)}
                title={isCollapsed ? label : ""}
              >
                {icon}
                <span className={`${isCollapsed ? "md:hidden" : ""}`}>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User info + logout */}
          <div className={`mt-auto pt-6 border-t border-slate-700 ${isCollapsed ? "md:hidden" : ""}`}>
            <div className="flex items-center gap-3 mb-4 px-2 py-1">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                {userData?.firstName?.charAt(0) || userData?.email?.charAt(0) || "U"}
              </div>
              <div className="truncate">
                <p className="font-medium text-sm truncate">{userData?.firstName || "User"}</p>
                <p className="text-xs text-slate-400 truncate">{userData?.email || ""}</p>
              </div>
            </div>
            <button
              onClick={logoutUser}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-slate-300 hover:bg-slate-800 hover:text-red-400 transition-colors"
            >
              <LogOut size={18} />
              <span className={`${isCollapsed ? "md:hidden" : ""}`}>Logout</span>
            </button>
          </div>
        </div>
      )}

    </>
  );
};

export default Sidebar;
