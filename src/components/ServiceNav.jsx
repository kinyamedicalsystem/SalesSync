import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function ServiceNav() {
    const [open, setOpen] = useState(false);
    const user = localStorage.getItem("user");
    const navigate = useNavigate();
    const linkStyle = ({ isActive }) =>
        `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
    ${isActive
            ? "bg-gradient-to-r from-teal-500/30 to-emerald-500/30 text-teal-300 shadow-lg border border-teal-500/50"
            : "text-gray-300 hover:text-white hover:bg-white/10"
        }`;


    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/5 border-b border-white/10 shadow-lg px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <h1 className="text-lg font-bold text-teal-400 tracking-wide"><i className="fa-solid fa-toolbox me-1"></i>
                     SI Reports
                    </h1>

                    <div className="hidden md:flex gap-3">
                        <NavLink to="/report" end className={linkStyle}><i className="fas fa-tools me-1"></i>Service</NavLink>
                        <NavLink to="/report/installationReport" className={linkStyle}> <i className="fas fa-cogs me-1"></i>Installation</NavLink>
                    </div>
                </div>
                {/* RIGHT SIDE */}
                <div className="flex items-center gap-4">

                    {/* USER BADGE */}
                    <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                        <i className="fa-solid fa-user text-teal-400 text-sm"></i>
                        <span className="text-xs text-white font-medium">{user}</span>
                    </div>

                    {/* HOME BUTTON */}
                    <button
                        onClick={() => navigate("/main")}
                        className="p-2 rounded-lg hover:bg-white/10 transition"
                    >
                        <i className="fa-solid fa-house text-teal-400"></i>
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


            {open && (
                <div className="md:hidden zbg-slate-900/95 backdrop-blur-lg border-b border-white/10 flex flex-col px-4 py-4 gap-3 animate-fadeIn sticky top-14 z-40">
                    <NavLink to="/report" end className={linkStyle} onClick={() => setOpen(false)}>
                        <i className="fas fa-tools me-1"></i> Service
                    </NavLink>
                    <NavLink to="/report/installationReport" className={linkStyle} onClick={() => setOpen(false)}>
                        <i className="fas fa-cogs me-1"></i> Installation
                    </NavLink>
                </div>
            )}
            <div className="flex-1 ">
                <Outlet />
            </div>
        </div>
    )
}