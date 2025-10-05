import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axios";


const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const userId = useSelector((state) => state.user.userData?._id);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            toast.error("Please fill all fields");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const res = await axiosInstance.put(`/auth/change-password/${userId}`, {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            if (res.data.success) {
                toast.success(res.data.message || "Password changed successfully");
                setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                toast.error(res.data.message || "Failed to change password");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Current Password</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter current password"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter new password"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Confirm new password"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full transition"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Change Password"}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
