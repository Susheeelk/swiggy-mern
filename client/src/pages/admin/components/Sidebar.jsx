// src/components/SidebarAdmin.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FiGrid,
    FiUsers,
    FiShoppingBag,
    FiBox,
    FiList,
    FiSettings,
    FiLogOut,
    FiMenu,
    FiX
} from "react-icons/fi";
import axiosInstance from "../../../api/axios";
import { clearUserData } from "../../../feature/userSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const adminLinks = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FiGrid /> },
    { path: "/admin/dashboard/users", label: "Users", icon: <FiUsers /> },
    { path: "/admin/dashboard/vendors", label: "Vendors", icon: <FiUsers /> },
    { path: "/admin/dashboard/foods", label: "Foods", icon: <FiBox /> },
    { path: "/admin/dashboard/resturents", label: "Restaurents", icon: <FiBox /> },
    { path: "/admin/dashboard/orders", label: "Orders", icon: <FiShoppingBag /> },
    { path: "/admin/dashboard/categories", label: "Categories", icon: <FiList /> },
    { path: "/admin/dashboard/settings", label: "Settings", icon: <FiSettings /> }
];

const SidebarAdmin = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()


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
            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center justify-between bg-white p-4 shadow-md">
                <h2 className="text-2xl font-bold text-orange-500">Admin Panel</h2>
                <button onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`
                    bg-white shadow-md p-4
                    fixed top-0 left-0 h-full z-50 transition-transform
                    md:translate-x-0 md:static md:h-fit md:w-64
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <h2 className="text-2xl font-bold text-orange-500 mb-6 md:block hidden">
                    Admin Panel
                </h2>
                <ul className="space-y-2">
                    {adminLinks.map((link) => (
                        <li key={link.path}>
                            <NavLink
                                to={link.path}
                                end={link.path === "/admin/dashboard"}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-2 rounded hover:bg-orange-100 ${isActive
                                        ? "bg-orange-500 text-white"
                                        : "text-gray-700"
                                    }`
                                }
                                onClick={() => setIsOpen(false)} // Close on mobile
                            >
                                <span className="text-xl">{link.icon}</span>
                                <span className="text-sm font-medium">{link.label}</span>
                            </NavLink>
                        </li>
                    ))}
                    {/* Static Logout Button */}
                    <li
                        className="flex gap-3 p-2 text-gray-700 cursor-pointer hover:bg-red-100 rounded transition-all"
                        onClick={() => {
                            handleLogout()
                            setIsOpen(false);
                        }}
                    >
                        <FiLogOut className="text-xl" />
                        <span className="text-sm font-medium">Logout</span>
                    </li>
                </ul>
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-30 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default SidebarAdmin;
