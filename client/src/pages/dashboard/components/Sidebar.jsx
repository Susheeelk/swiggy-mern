// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axios";
import {
    FiUser,
    FiPackage,
    FiMapPin,
    FiHeart,
    FiLock,
    FiLogOut,
    FiMenu,
    FiX,
} from "react-icons/fi";
import { clearUserData } from "../../../feature/userSlice";

const links = [
    { path: "/dashboard", label: "Profile", icon: <FiUser /> },
    { path: "/dashboard/orders", label: "Orders", icon: <FiPackage /> },
    { path: "/dashboard/addresses", label: "Addresses", icon: <FiMapPin /> },
    { path: "/dashboard/wishlist", label: "Wishlist", icon: <FiHeart /> },
    { path: "/dashboard/change-password", label: "Change Password", icon: <FiLock /> },
];

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
            dispatch(clearUserData());
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Logout failed");
        }
    };

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between bg-white p-4 shadow-sm sticky top-0 z-40">
                <h2 className="text-lg font-semibold text-orange-500">My Account</h2>
                <button onClick={() => setIsOpen(!isOpen)} className="text-2xl text-orange-500">
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed md:relative top-0 left-0 h-full md:h-auto md:min-h-screen 
                bg-white w-64 p-4 shadow-md z-40 transform transition-transform duration-300 ease-in-out
                overflow-y-auto rounded-lg md:rounded-none
                ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <h2 className="text-lg font-semibold mb-4 hidden md:block">My Account</h2>

                <ul className="space-y-2">
                    {links.map((link) => (
                        <li key={link.path}>
                            <NavLink
                                to={link.path}
                                end={link.path === "/dashboard"}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-2 rounded transition-all duration-200 
                                    hover:bg-orange-100 ${isActive
                                        ? "bg-orange-500 text-white"
                                        : "text-gray-700"
                                    }`
                                }
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="text-xl">{link.icon}</span>
                                <span className="text-sm font-medium">{link.label}</span>
                            </NavLink>
                        </li>
                    ))}

                    {/* Logout */}
                    <li
                        onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                        }}
                        className="flex gap-3 p-2 text-gray-700 cursor-pointer hover:bg-red-100 rounded transition-all"
                    >
                        <FiLogOut className="text-xl" />
                        <span className="text-sm font-medium">Logout</span>
                    </li>
                </ul>
            </div>

            {/* Overlay for Mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
                />
            )}
        </>
    );
};

export default Sidebar;
