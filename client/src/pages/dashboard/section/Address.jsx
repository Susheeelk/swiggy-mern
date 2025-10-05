import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    setAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
} from "../../../feature/addressSlice";
import axiosInstance from "../../../api/axios";

const Addresses = () => {
    const dispatch = useDispatch();
    const addresses = useSelector((state) => state.address.addresses);

    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        pincode: "",
        house: "",
        area: "",
        landmark: "",
        city: "",
        state: "",
        default: false,
    });
    const [editingId, setEditingId] = useState(null);

    // Fetch all addresses on mount
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await axiosInstance.get("/address");
                dispatch(setAddresses(res.data));
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to fetch addresses");
            } finally {
                setLoading(false);
            }
        };
        fetchAddresses();
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async () => {
        const payload = { ...formData };

        // Validate required fields
        if (!payload.fullName || !payload.phone || !payload.house || !payload.city || !payload.state || !payload.pincode) {
            return toast.error("Please fill all required fields!");
        }

        try {
            if (editingId) {
                const res = await axiosInstance.put(`/address/${editingId}`, payload);
                dispatch(updateAddress(res.data));
                toast.success("Address updated!");
            } else {
                const res = await axiosInstance.post("/address", payload);
                dispatch(addAddress(res.data));
                toast.success("Address added!");
            }

            // Reset form
            setFormData({
                fullName: "",
                phone: "",
                pincode: "",
                house: "",
                area: "",
                landmark: "",
                city: "",
                state: "",
                default: false,
            });
            setEditingId(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save address");
        }
    };

    const handleEdit = (addr) => {
        setEditingId(addr._id);
        setFormData({
            fullName: addr.fullName,
            phone: addr.phone,
            pincode: addr.pincode,
            house: addr.house,
            area: addr.area || "",
            landmark: addr.landmark || "",
            city: addr.city,
            state: addr.state,
            default: addr.default || false,
        });
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/address/${id}`);
            dispatch(deleteAddress(id));
            toast.success("Address deleted!");
            if (editingId === id) {
                setEditingId(null);
                setFormData({
                    fullName: "",
                    phone: "",
                    pincode: "",
                    house: "",
                    area: "",
                    landmark: "",
                    city: "",
                    state: "",
                    default: false,
                });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete address");
        }
    };

    if (loading) return <p>Loading addresses...</p>;

    return (
        <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">My Addresses</h2>

            {/* Add/Edit Form */}
            <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded shadow-sm flex flex-col gap-2">
                    <h3 className="font-semibold mb-2">{editingId ? "Edit Address" : "Add New Address"}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Full Name*"
                            className="border px-2 py-1 rounded w-full"
                        />
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone*"
                            className="border px-2 py-1 rounded w-full"
                        />
                        <input
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            placeholder="Pincode*"
                            className="border px-2 py-1 rounded w-full"
                        />
                        <input
                            name="house"
                            value={formData.house}
                            onChange={handleChange}
                            placeholder="House / Building*"
                            className="border px-2 py-1 rounded w-full"
                        />
                        <input
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            placeholder="Area / Locality"
                            className="border px-2 py-1 rounded w-full"
                        />
                        <input
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleChange}
                            placeholder="Landmark"
                            className="border px-2 py-1 rounded w-full"
                        />
                        <input
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City*"
                            className="border px-2 py-1 rounded w-full"
                        />
                        <input
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="State*"
                            className="border px-2 py-1 rounded w-full"
                        />
                        <label className="flex items-center gap-2 col-span-full">
                            <input
                                type="checkbox"
                                name="default"
                                checked={formData.default}
                                onChange={handleChange}
                            />
                            <span>Set as default</span>
                        </label>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="w-full mt-2 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
                    >
                        {editingId ? "Update Address" : "Add Address"}
                    </button>
                </div>
            </div>

            {/* Address List */}
            {addresses.length === 0 ? (
                <div className="border-dashed border-2 border-gray-300 p-6 rounded text-center text-gray-600">
                    No addresses found. Please add a new one.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {addresses.map((addr) => (
                        <div
                            key={addr._id}
                            className={`border rounded-lg p-4 shadow-sm flex flex-col justify-between ${addr.default ? "border-orange-500" : ""}`}
                        >
                            <p className="text-gray-800 text-sm mb-3">
                                {addr.fullName}, {addr.phone} <br />
                                {addr.house}, {addr.area}, {addr.landmark} <br />
                                {addr.city} - {addr.pincode}, {addr.state}
                            </p>
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => handleEdit(addr)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(addr._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Addresses;
