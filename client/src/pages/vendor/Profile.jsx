import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProfileData } from "../../feature/userSlice";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axios";

const VendorProfile = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user.userData?._id);
    const profileData = useSelector((state) => state.user.profileData);

    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        image: null,
    });
    const [loading, setLoading] = useState(false);

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;
            try {
                const res = await axiosInstance.get("/auth/me");
                dispatch(setProfileData(res.data.user || res.data));
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to fetch profile");
            }
        };
        fetchProfile();
    }, [userId, dispatch]);

    // Prefill form when modal opens
    useEffect(() => {
        if (modalOpen && profileData) {
            setFormData({
                name: profileData.name,
                email: profileData.email,
                phone: profileData.phone || "",
                image: null,
            });
        }
    }, [modalOpen, profileData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData((prev) => ({ ...prev, image: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            if (formData.image) data.append("image", formData.image);

            const res = await axiosInstance.put("/auth/edit-profile", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setProfileData(res.data.user));
                setModalOpen(false);
            } else {
                toast.error(res.data.message || "Update failed");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (!profileData) return <p className="p-4 text-center">Loading profile...</p>;

    return (
        <div className="bg-white shadow rounded-lg p-6 max-w-3xl mx-auto min-h-[70vh]">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Profile Information</h2>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mb-6">
                <div className="w-32 h-32 flex-shrink-0 rounded-full overflow-hidden border border-gray-200">
                    <img
                        src={profileData.image || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 mt-4 sm:mt-0">
                    <p className="text-gray-700 font-medium">Name: {profileData.name}</p>
                    <p className="text-gray-700 font-medium mt-1">Email: {profileData.email}</p>
                    <p className="text-gray-700 font-medium mt-1">Phone: {profileData.phone || "-"}</p>

                    <button
                        onClick={() => setModalOpen(true)}
                        className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                    >
                        Update Profile
                    </button>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setModalOpen(false)} />

                    <div className="bg-white rounded-lg shadow-lg p-6 z-50 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Update Profile</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="text-gray-600 text-sm">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-gray-600 text-sm">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-gray-600 text-sm">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    maxLength="10"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>

                            <div>
                                <label className="text-gray-600 text-sm">Profile Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="w-full mt-1"
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                                >
                                    {loading ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorProfile;
