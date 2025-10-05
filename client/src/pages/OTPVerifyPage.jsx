import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";
import { useEffect } from "react";

const OTPVerifyPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Redirect to Signup if no email found
    useEffect(() => {
        if (!email) {
            toast.error("Please signup first to verify OTP!");
            navigate("/signup");
        }
    }, [email, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!otp) {
            toast.error("Please enter OTP");
            return;
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post("/auth/verifyOtp", { email, otp });

            if (res.data.success) {
                toast.success(res.data.message || "OTP Verified! Please Login.");
                navigate("/login");
            } else {
                toast.error(res.data.message || "Invalid OTP");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-orange-500">Verify OTP</h2>
                <p className="text-center mb-4 text-gray-600">
                    OTP sent to <span className="font-medium">{email}</span>
                </p>
                <form onSubmit={handleVerify} className="space-y-4">
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-center text-lg tracking-widest"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OTPVerifyPage;
