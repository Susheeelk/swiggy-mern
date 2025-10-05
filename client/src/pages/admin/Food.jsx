import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import {
    createFoodThunk,
    updateFoodThunk,
    deleteFoodThunk,
    fetchFoods,
} from "../../feature/foodSlice";
import { fetchCategories } from "../../feature/categorySlice";
import { fetchRestaurants } from "../../feature/Action/restaurantActions";

const Foods = () => {
    const dispatch = useDispatch();
    const { foods } = useSelector((state) => state.food);
    const { categories } = useSelector((state) => state.category);
    const { restaurants } = useSelector((state) => state.restaurant);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);

    const [newFood, setNewFood] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        restaurant: "",
        image: null,
        preview: "",
        isAvailable: true,
    });

    useEffect(() => {
        dispatch(fetchFoods());
        dispatch(fetchCategories());
        dispatch(fetchRestaurants());
    }, [dispatch]);

    const handleImageChange = (e, isEdit = false) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            if (isEdit) setSelectedFood({ ...selectedFood, image: file, preview });
            else setNewFood({ ...newFood, image: file, preview });
        }
    };

    const handleInputChange = (e, isEdit = false) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;
        if (isEdit) setSelectedFood({ ...selectedFood, [name]: val });
        else setNewFood({ ...newFood, [name]: val });
    };

    const handleAddFood = () => {
        const formData = new FormData();
        Object.keys(newFood).forEach((key) => {
            if (key !== "preview") formData.append(key, newFood[key]);
        });
        dispatch(createFoodThunk(formData));
        setShowAddModal(false);
        setNewFood({
            name: "",
            description: "",
            price: "",
            category: "",
            restaurant: "",
            image: null,
            preview: "",
            isAvailable: true,
        });
    };

    const handleEdit = (food) => {
        setSelectedFood({
            ...food,
            category: food.category?._id || food.category,
            restaurant: food.restaurant?._id || food.restaurant,
            preview: food.image,
        });
        setShowEditModal(true);
    };

    const handleEditSave = () => {
        const formData = new FormData();
        Object.keys(selectedFood).forEach((key) => {
            if (key !== "preview") formData.append(key, selectedFood[key]);
        });
        dispatch(updateFoodThunk(selectedFood._id, formData));
        setShowEditModal(false);
        setSelectedFood(null);
    };

    const handleDelete = (id) => {
        dispatch(deleteFoodThunk(id));
    };

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">Foods</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                    + Add Food
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
                            <th className="py-3 px-4">Price</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Restaurant</th>
                            <th className="py-3 px-4">Available</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foods?.map((food, index) => (
                            <tr key={food._id} className="border-b">
                                <td className="py-3 px-4">{index + 1}</td>
                                <td className="py-3 px-4">
                                    <img
                                        src={food.image}
                                        alt={food.name}
                                        className="h-12 w-12 object-cover rounded border"
                                    />
                                </td>
                                <td className="py-3 px-4">{food.name}</td>
                                <td className="py-3 px-4">₹{food.price}</td>
                                <td className="py-3 px-4">{food.category?.name}</td>
                                <td className="py-3 px-4">{food.restaurant?.name}</td>
                                <td className="py-3 px-4">{food.isAvailable ? "Yes" : "No"}</td>
                                <td className="py-3 px-4 text-center">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => handleEdit(food)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <FiEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(food._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <Modal
                    title="Add New Food"
                    food={newFood}
                    categories={categories}
                    restaurants={restaurants}
                    onClose={() => setShowAddModal(false)}
                    onChange={handleInputChange}
                    onImageChange={handleImageChange}
                    onSave={handleAddFood}
                />
            )}

            {/* Edit Modal */}
            {showEditModal && selectedFood && (
                <Modal
                    title="Edit Food"
                    food={selectedFood}
                    categories={categories}
                    restaurants={restaurants}
                    onClose={() => setShowEditModal(false)}
                    onChange={(e) => handleInputChange(e, true)}
                    onImageChange={(e) => handleImageChange(e, true)}
                    onSave={handleEditSave}
                />
            )}
        </div>
    );
};

const Modal = ({ title, food, categories, restaurants, onClose, onChange, onImageChange, onSave }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-xl space-y-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="grid grid-cols-2 gap-4">
                <input
                    name="name"
                    placeholder="Food Name"
                    value={food.name}
                    onChange={onChange}
                    className="border rounded px-3 py-2"
                />
                <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={food.price}
                    onChange={onChange}
                    className="border rounded px-3 py-2"
                />
                <select
                    name="category"
                    value={food.category || ""}
                    onChange={onChange}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Select Category</option>
                    {categories?.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <select
                    name="restaurant"
                    value={food.restaurant || ""}
                    onChange={onChange}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Select Restaurant</option>
                    {restaurants?.map((r) => (
                        <option key={r._id} value={r._id}>
                            {r.name}
                        </option>
                    ))}
                </select>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="isAvailable" checked={food.isAvailable} onChange={onChange} />
                    Available
                </label>
                <input type="file" accept="image/*" onChange={onImageChange} className="col-span-2" />
                {food.preview && <img src={food.preview} alt="Preview" className="h-20 w-20 object-cover rounded border" />}
                <textarea
                    name="description"
                    placeholder="Description"
                    value={food.description}
                    onChange={onChange}
                    className="col-span-2 border rounded px-3 py-2"
                />
            </div>
            <div className="flex justify-end gap-3">
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

export default Foods;
