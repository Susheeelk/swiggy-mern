// src/components/VendorSidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FiGrid,
    FiUsers,
    FiShoppingBag,
    FiBox,
    FiList,
    FiLogOut,
    FiLock,
    FiMenu,
    FiX
} from "react-icons/fi";
import { toast } from "react-toastify";
import { clearUserData } from "../../../feature/userSlice";
import axiosInstance from "../../../api/axios";
import { useDispatch } from "react-redux";

const adminLinks = [
    { path: "/vendor/dashboard", label: "Dashboard", icon: <FiGrid /> },
    { path: "/vendor/dashboard/profile", label: "Profile", icon: <FiUsers /> },
    { path: "/vendor/dashboard/foods", label: "Foods", icon: <FiBox /> },
    { path: "/vendor/dashboard/resturents", label: "Restaurents", icon: <FiBox /> },
    { path: "/vendor/dashboard/orders", label: "Orders", icon: <FiShoppingBag /> },
    { path: "/vendor/dashboard/categories", label: "Categories", icon: <FiList /> },
    { path: "/vendor/dashboard/change-password", label: "Change Password", icon: <FiLock /> },
];

const VendorSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/auth/logout"); // call backend logout
            dispatch(clearUserData()); // clear Redux user state
            toast.success("Logged out successfully");
            navigate("/login"); // redirect to login
        } catch (err) {
            toast.error(err.response?.data?.message || "Logout failed");
        }
    };

    return (
        <>
            {/* Toggle Button for Mobile */}
            <div className="md:hidden flex items-center justify-between p-4 shadow-sm bg-white sticky top-0 z-40">
                <h2 className="text-xl font-bold text-orange-500">Vendor Panel</h2>
                <button onClick={() => setIsOpen(!isOpen)} className="text-2xl text-orange-500">
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed md:relative top-0 left-0 h-full bg-white w-64 p-4 shadow-md z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <h2 className="text-2xl font-bold text-orange-500 mb-6 hidden md:block">Vendor Panel</h2>
                <ul className="space-y-2">
                    {adminLinks.map((link) => (
                        <li key={link.path}>
                            <NavLink
                                to={link.path}
                                end={link.path === "/vendor/dashboard"}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-2 rounded hover:bg-orange-100 transition-all duration-200 ${isActive ? "bg-orange-500 text-white" : "text-gray-700"
                                    }`
                                }
                                onClick={() => setIsOpen(false)} // Auto-close on mobile
                            >
                                <span className="text-xl">{link.icon}</span>
                                <span className="text-sm font-medium">{link.label}</span>
                            </NavLink>
                        </li>
                    ))}
                    <li
                        className="flex gap-3 p-2 text-gray-700 cursor-pointer hover:bg-red-100 rounded transition-all"
                        onClick={handleLogout}
                    >
                        <FiLogOut className="text-xl" />
                        <span className="text-sm font-medium">Logout</span>
                    </li>
                </ul>
            </div>

            {/* Overlay (click to close) on mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
                ></div>
            )}
        </>
    );
};

export default VendorSidebar;
