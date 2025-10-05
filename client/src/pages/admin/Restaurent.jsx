import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import {
    createRestaurant,
    editRestaurant,
    fetchRestaurants,
    removeRestaurant,
} from "../../feature/Action/restaurantActions";
import { fetchCategories } from "../../feature/categorySlice";


const Restaurants = () => {
    const dispatch = useDispatch();
    const { restaurants } = useSelector((state) => state.restaurant || { restaurants: [] });
    const { categories } = useSelector((state) => state.category || { categories: [] });

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        categories: "", // keep same key as backend expects (string of id or comma-separated ids)
        image: null,
        preview: "",
    });

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState(null);

    // fetch categories & restaurants on mount
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchRestaurants());
    }, [dispatch]);

    const handleChange = (e, isEdit = false) => {
        const { name, value } = e.target;
        if (isEdit) {
            setEditData((prev) => ({ ...prev, [name]: value }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = (e, isEdit = false) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        if (isEdit) {
            setEditData((prev) => ({ ...prev, image: file, preview }));
        } else {
            setFormData((prev) => ({ ...prev, image: file, preview }));
        }
    };

    // Add restaurant
    const handleAdd = async () => {
        // basic validation
        if (!formData.name) {
            return alert("Please provide restaurant name");
        }

        // prepare payload (your createRestaurant action should convert to FormData)
        await dispatch(createRestaurant(formData));

        // reset form & close modal
        setFormData({
            name: "",
            address: "",
            phone: "",
            categories: "",
            image: null,
            preview: "",
        });
        setShowAddModal(false);
    };

    // Open edit modal with data
    const handleEdit = (rest) => {
        // map backend fields to our editData shape; ensure categories is string/ids as expected
        setEditData({
            ...rest,
            categories: Array.isArray(rest.categories) ? (rest.categories[0]?._id || "") : (rest.categories || ""),
            preview: rest.image || "",
        });
        setShowEditModal(true);
    };

    // Save edited restaurant
    const handleEditSave = async () => {
        if (!editData || !editData._id) return;
        await dispatch(editRestaurant(editData._id, editData));
        setShowEditModal(false);
        setEditData(null);
    };

    // Delete restaurant
    const handleDelete = (id) => {
        if (!window.confirm("Delete this restaurant?")) return;
        dispatch(removeRestaurant(id));
    };

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">Restaurants</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                    + Add Restaurant
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="py-3 px-4">#</th>
                            <th className="py-3 px-4">Image</th>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Phone</th>
                            <th className="py-3 px-4">Address</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(restaurants) && restaurants.length > 0 ? (
                            restaurants.map((rest, i) => (
                                <tr key={rest._id || i} className="border-b">
                                    <td className="py-3 px-4">{i + 1}</td>
                                    <td className="py-3 px-4">
                                        <img
                                            src={rest.image || ""}
                                            alt={rest.name || "img"}
                                            className="h-12 w-12 object-cover rounded border"
                                        />
                                    </td>
                                    <td className="py-3 px-4">{rest.name}</td>
                                    <td className="py-3 px-4">
                                        {Array.isArray(rest.categories)
                                            ? rest.categories.map((c) => c.name).join(", ")
                                            : rest.categories}
                                    </td>
                                    <td className="py-3 px-4">{rest.phone}</td>
                                    <td className="py-3 px-4">{rest.address}</td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => handleEdit(rest)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(rest._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-6 text-center text-gray-500">
                                    No restaurants yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <Modal
                    title="Add Restaurant"
                    data={formData}
                    categories={categories}
                    onChange={handleChange}
                    onImageChange={handleImageChange}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAdd}
                />
            )}

            {/* Edit Modal */}
            {showEditModal && editData && (
                <Modal
                    title="Edit Restaurant"
                    data={editData}
                    categories={categories}
                    onChange={(e) => handleChange(e, true)}
                    onImageChange={(e) => handleImageChange(e, true)}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditData(null);
                    }}
                    onSave={handleEditSave}
                />
            )}
        </div>
    );
};

// Modal component receives categories as prop now
const Modal = ({ title, data, categories = [], onChange, onImageChange, onClose, onSave }) => {
    // ensure data is always an object
    const safeData = data || {};

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-xl space-y-4">
                <h2 className="text-xl font-semibold">{title}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        name="name"
                        placeholder="Restaurant Name"
                        value={safeData.name || ""}
                        onChange={onChange}
                        className="border rounded px-3 py-2"
                    />
                    <input
                        name="phone"
                        placeholder="Phone"
                        value={safeData.phone || ""}
                        onChange={onChange}
                        className="border rounded px-3 py-2"
                    />

                    {/* categories select uses same key "categories" as top-level state */}
                    <select
                        name="categories"
                        className="w-full border px-3 py-2 rounded"
                        value={safeData.categories || ""}
                        onChange={onChange}
                    >
                        <option value="">-- Select Category --</option>
                        {Array.isArray(categories) &&
                            categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                    </select>

                    <input
                        name="address"
                        placeholder="Address"
                        value={safeData.address || ""}
                        onChange={onChange}
                        className="col-span-2 border rounded px-3 py-2"
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageChange}
                        className="col-span-2"
                    />
                    {safeData.preview && (
                        <img
                            src={safeData.preview}
                            alt="Preview"
                            className="h-20 w-20 object-cover rounded border"
                        />
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={onClose} className="px-4 py-2 rounded border hover:bg-gray-100">
                        Cancel
                    </button>
                    <button onClick={onSave} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Restaurants;
