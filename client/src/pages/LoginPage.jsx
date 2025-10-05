import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axiosInstance from "../api/axios";
import { setUserData } from "../feature/userSlice";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // 👈 toggle state

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            // POST request to backend
            const res = await axiosInstance.post("/auth/login", formData, {
                withCredentials: true, // cookie ke liye
            });

            // Check backend response
            if (res.data.success) {
                toast.success(res.data.message || "Login successful!");
                dispatch(setUserData(res.data.user)); // Redux store update
                navigate("/"); // redirect to homepage
            } else {
                toast.error(res.data.message || "Login failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-orange-500">
                    Login to SwiggyClone
                </h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-orange-500 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Signup Redirect */}
                <p className="text-sm text-center mt-5">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-orange-500 font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
