import React, { useState } from "react";
import axiosInstance from "../api/axios"; // aapka axios file ka path
import { toast } from "react-toastify";

const ForgetPassword = () => {
    const [step, setStep] = useState("sendOtp");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    // 1️⃣ Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/auth/sendOtp", { email });
            toast.success(res.data.message);
            setStep("verifyOtp");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        }
    };

    // 2️⃣ Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/auth/verify-reset", { email, otp });
            toast.success(res.data.message);
            setStep("resetPassword");
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid or expired OTP");
        }
    };

    // 3️⃣ Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        try {
            const res = await axiosInstance.post("/auth/reset-password", {
                email,
                newPassword,
                confirmPassword,
            });
            toast.success(res.data.message || "Password reset successfully!");
            setTimeout(() => {
                window.location.href = "/login"; // OR use navigate from react-router-dom
            }, 2000);
            setStep("sendOtp");
            setEmail("");
            setOtp("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[57vh] px-4 py-10">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-center text-orange-500">
                    Forget Password
                </h2>

                {/* Step 1: Send OTP */}
                {step === "sendOtp" && (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
                        >
                            Send OTP
                        </button>
                    </form>
                )}

                {/* Step 2: Verify OTP */}
                {step === "verifyOtp" && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Enter OTP</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter the OTP sent to your email"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
                        >
                            Verify OTP
                        </button>
                    </form>
                )}

                {/* Step 3: Reset Password */}
                {step === "resetPassword" && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">New Password</label>
                            <input
                                type="password"
                                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
                        >
                            Reset Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgetPassword;
