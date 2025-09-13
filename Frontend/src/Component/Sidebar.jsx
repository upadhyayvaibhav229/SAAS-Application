import React from "react";
// import { useAdminContext } from "../Contexts/AdminContext";
import { NavLink } from "react-router-dom";
// import { assets } from "../assets/admin_assets/assets";
// import { assets } from "../assets/assets_admin/assets";


const Sidebar = () => {
  // const { adminToken } = useAdminContext();
  return (
    <div className="min-h-screen bg-white border-r md:w-72">
      <ul className="flex flex-col items-start gap-3">
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-3 border-[#5f6FFF]" : "text-[#1F2937]"
            } `
          }
          // to="/addProducts"
          style={{ width: "100%" }}
        >
          {/* <img src={assets.add_icon} alt="" /> */}
          <p className="hidden md:block">DashBoard</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-3 border-[#5f6FFF]" : "text-[#1F2937]"
            } `
          }
          // to="/all-products"
          style={{ width: "100%" }}
        >
          {/* <img src={assets.order_icon} alt="" /> */}
          <p className="hidden md:block">Customers</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-3 border-[#5f6FFF]" : "text-[#1F2937]"
            } `
          }
          // to="/orders"
          style={{ width: "100%" }}
        >
          {/* <img src={assets.order_icon} alt="" /> */}
          <p className="hidden md:block">Orders</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-3 border-[#5f6FFF]" : "text-[#1F2937]"
            } `
          }
          // to="/orders"
          style={{ width: "100%" }}
        >
          {/* <img src={assets.order_icon} alt="" /> */}
          <p className="hidden md:block">Payments</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-3 border-[#5f6FFF]" : "text-[#1F2937]"
            } `
          }
          // to="/orders"
          style={{ width: "100%" }}
        >
          {/* <img src={assets.order_icon} alt="" /> */}
          <p className="hidden md:block">Reports</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-3 border-[#5f6FFF]" : "text-[#1F2937]"
            } `
          }
          // to="/orders"
          style={{ width: "100%" }}
        >
          {/* <img src={assets.order_icon} alt="" /> */}
          <p className="hidden md:block">Users</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-r-3 border-[#5f6FFF]" : "text-[#1F2937]"
            } `
          }
          // to="/orders"
          style={{ width: "100%" }}
        >
          {/* <img src={assets.order_icon} alt="" /> */}
          <p className="hidden md:block">Settings</p>
        </NavLink>

      </ul>
    </div>
  );
};

export default Sidebar;

