import React, { useState } from "react";
import { FiMenu, FiX, FiShoppingCart, FiSearch, FiUser } from "react-icons/fi";
import CartDrawer from "./CartDrower";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../api/axios";
import { clearUserData } from "../feature/userSlice";
import { toast } from "react-toastify";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [cartOpen, setCartOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ✅ Redux user data
    const user = useSelector((state) => state.user.userData);

    // ✅ Redux cart data
    const { cartItems } = useSelector((state) => state.cart);
    const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0);



    // logout functionallity here
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

    const toggleCart = () => setCartOpen(!cartOpen);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleSearch = () => setSearchOpen(!searchOpen);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchOpen(false); // overlay close
            setSearchQuery("");   // input clear
        }
    };

    return (
        <nav className="bg-white shadow-md fixed w-full z-50">
            <div className="relative container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <div className="text-2xl font-bold text-orange-500">
                    <Link to="/">SwiggyClone</Link>
                </div>

                {/* Middle NavLinks */}
                <ul className="hidden md:flex space-x-6 font-medium items-center">
                    <li className="hover:text-orange-500 cursor-pointer">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="hover:text-orange-500 cursor-pointer">
                        <Link to="/restaurants">Restaurants</Link>
                    </li>
                    <li className="hover:text-orange-500 cursor-pointer">Offers</li>
                    <li className="hover:text-orange-500 cursor-pointer">Contact</li>
                </ul>

                {/* Right Icons */}
                <div className="flex items-center space-x-4 relative">
                    {/* Search */}
                    <button onClick={toggleSearch} className="text-gray-600 hover:text-orange-500">
                        <FiSearch size={20} />
                    </button>

                    {/* Cart with count */}
                    <div className="relative cursor-pointer" onClick={toggleCart}>
                        <FiShoppingCart size={22} className="hover:text-orange-500" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                                {cartCount}
                            </span>
                        )}
                    </div>

                    {/* Profile */}
                    {user ? (
                        <div className="relative">
                            <img
                                src={user.image || "https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small_2x/Basic_Ui__28186_29.jpg"}
                                alt="profile"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-8 h-8 rounded-full cursor-pointer border-2 border-orange-400"
                            />
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2 z-50">
                                    <div className="flex items-center px-4 py-2 border-b space-x-3">
                                        <img
                                            src={user.image || "https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small_2x/Basic_Ui__28186_29.jpg"}
                                            alt="profile"
                                            className="w-8 h-8 rounded-full border border-orange-400"
                                        />
                                        <span className="text-gray-700 font-medium">{user.name}</span>
                                    </div>
                                    {user.type === "user" && <Link
                                        to="/dashboard"
                                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Dashboard
                                    </Link>}
                                    {user.type === "vendor" && (
                                        <Link
                                            to="/vendor/dashboard"
                                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Vendor Dashboard
                                        </Link>
                                    )}
                                    {user.type === "admin" && (
                                        <Link
                                            to="/admin/dashboard"
                                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setDropdownOpen(false)
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login">
                            <FiUser size={22} className="cursor-pointer hover:text-orange-500" />
                        </Link>
                    )}

                    {/* Hamburger */}
                    <button className="md:hidden text-gray-600" onClick={toggleMenu}>
                        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {/* OVERLAY SEARCH BAR */}
                {searchOpen && (
                    <form
                        onSubmit={handleSearch}
                        className="absolute left-0 right-0 md:left-1/4 md:right-40 flex items-center bg-white border border-gray-300 rounded-md px-2 py-1 shadow-md"
                    >
                        <FiSearch className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="outline-none px-2 py-1 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />

                        <button
                            type="submit"
                            className="bg-orange-400 py-2 px-6 text-white rounded-full  hover:text-black ml-2"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={toggleSearch}
                            className="text-gray-600 hover:text-orange-500 ml-2"
                        >
                            <FiX size={20} />
                        </button>
                    </form>
                )}
            </div>

            {/* Mobile Menu */}
            {menuOpen && !searchOpen && (
                <ul className="md:hidden bg-white border-t border-gray-200">
                    <li className="py-3 px-4 hover:bg-gray-100 cursor-pointer">
                        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    </li>
                    <li className="py-3 px-4 hover:bg-gray-100 cursor-pointer">
                        <Link to="/restaurants" onClick={() => setMenuOpen(false)}>Restaurants</Link>
                    </li>
                    <li className="py-3 px-4 hover:bg-gray-100 cursor-pointer">Offers</li>
                    <li className="py-3 px-4 hover:bg-gray-100 cursor-pointer">Contact</li>
                    {user && (
                        <li className="py-3 px-4 hover:bg-gray-100 cursor-pointer">
                            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                        </li>
                    )}
                </ul>
            )}

            {/* ✅ Redux se cartItems pass kiye */}
            <CartDrawer isOpen={cartOpen} onClose={toggleCart} cartItems={cartItems} />
        </nav>
    );
};

export default Navbar;
