import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const linkStyle = ({ isActive }) =>
    `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
    ${
      isActive
        ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 shadow-lg border border-cyan-500/50"
        : "text-gray-300 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      {/* 🔥 NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/5 border-b border-white/10 shadow-lg px-6 py-3 flex justify-between items-center">

        {/* LEFT - LOGO + MENU */}
        <div className="flex items-center gap-8">
          <h1 className="text-lg font-bold text-cyan-400 tracking-wide"><i  class="fas fa-hospital-user me-2"></i>
          Sales Pipeline
          </h1>

          <div className="hidden md:flex gap-3">
            <NavLink to="/sales" end className={linkStyle}><i className="fa-solid fa-chart-pie me-1"></i> Dashboard</NavLink>
            <NavLink to="/sales/pipelinerecords" className={linkStyle}><i className="fas fa-table me-1"></i> Records</NavLink>
            <NavLink to="/sales/revenueforecast" className={linkStyle}><i className="fas fa-chart-line me-1"></i> Revenue</NavLink>
            <NavLink to="/sales/productforecast" className={linkStyle}><i className="fas fa-cubes me-1"></i> Product</NavLink>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* USER BADGE */}
          <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
            <i className="fa-solid fa-user text-cyan-400 text-sm"></i>
            <span className="text-xs text-white font-medium">{user}</span>
          </div>

          {/* HOME BUTTON */}
          <button
            onClick={() => navigate("/main")}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <i className="fa-solid fa-house text-cyan-400"></i>
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-white text-xl"
            onClick={() => setOpen(!open)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </nav>

      {/* 🔥 MOBILE MENU */}
      {open && (
        <div className="md:hidden zbg-slate-900/95 backdrop-blur-lg border-b border-white/10 flex flex-col px-4 py-4 gap-3 animate-fadeIn sticky top-14 z-40">
          <NavLink to="/sales" end className={linkStyle} onClick={() => setOpen(false)}>
            <i className="fa-solid fa-chart-pie me-1"></i>Dashboard
          </NavLink>
          <NavLink to="/sales/pipelinerecords" className={linkStyle} onClick={() => setOpen(false)}>
           <i className="fas fa-table me-1"></i> Records
          </NavLink>
          <NavLink to="/sales/revenueforecast" className={linkStyle} onClick={() => setOpen(false)}>
           <i className="fas fa-chart-line me-1"></i> Revenue
          </NavLink>
          <NavLink to="/sales/productforecast" className={linkStyle} onClick={() => setOpen(false)}>
            <i className="fas fa-cubes me-1"></i> Product
          </NavLink>
        </div>
      )}

      {/* 🔥 PAGE CONTENT */}
      <div className="flex-1 ">
        <Outlet />
      </div>
    </div>
  );
}