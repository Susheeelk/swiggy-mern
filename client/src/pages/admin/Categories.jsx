import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCategories,
    createCategory,
    editCategory,
    removeCategory,
} from "../../feature/categorySlice";

const Categories = () => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.category);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({
        name: "",
        image: null,
        preview: "",
    });

    // ----------------------
    // Fetch Categories
    // ----------------------
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleImageChange = (e, isEdit = false) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            if (isEdit) {
                setSelectedCategory({
                    ...selectedCategory,
                    image: file,
                    preview: imageUrl,
                });
            } else {
                setNewCategory({
                    ...newCategory,
                    image: file,
                    preview: imageUrl,
                });
            }
        }
    };

    // ----------------------
    // Add Category
    // ----------------------
    const handleAddCategory = () => {
        const formData = new FormData();
        formData.append("name", newCategory.name);
        if (newCategory.image) {
            formData.append("image", newCategory.image);
        }
        dispatch(createCategory(formData));
        setShowAddModal(false);
        setNewCategory({ name: "", image: null, preview: "" });
    };

    // ----------------------
    // Edit Category
    // ----------------------
    const handleEdit = (category) => {
        setSelectedCategory({
            ...category,
            preview: category.image,
        });
        setShowEditModal(true);
    };

    const handleEditSave = () => {
        const formData = new FormData();
        formData.append("name", selectedCategory.name);
        if (selectedCategory.image instanceof File) {
            formData.append("image", selectedCategory.image);
        }
        dispatch(editCategory(selectedCategory._id, formData));
        setShowEditModal(false);
        setSelectedCategory(null);
    };

    // ----------------------
    // Delete Category
    // ----------------------
    const handleDelete = (categoryId) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            dispatch(removeCategory(categoryId));
        }
    };

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                    + Add Category
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                {loading ? (
                    <p className="p-4">Loading...</p>
                ) : error ? (
                    <p className="p-4 text-red-500">{error}</p>
                ) : (
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="py-3 px-4">#</th>
                                <th className="py-3 px-4">Image</th>
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4 text-center w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories?.map((cat, index) => (
                                <tr key={cat._id} className="border-b">
                                    {console.log(cat)}
                                    <td className="py-3 px-4">{index + 1}</td>
                                    <td className="py-3 px-4">
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="h-12 w-12 object-cover rounded border"
                                        />
                                    </td>
                                    <td className="py-3 px-4">{cat.name}</td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat._id)}
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
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) =>
                                        setNewCategory({ ...newCategory, name: e.target.value })
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                    placeholder="Category name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Choose Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e)}
                                    className="w-full"
                                />
                                {newCategory.preview && (
                                    <img
                                        src={newCategory.preview}
                                        alt="Preview"
                                        className="h-20 w-20 mt-3 rounded border object-cover"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCategory}
                                className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    value={selectedCategory.name}
                                    onChange={(e) =>
                                        setSelectedCategory({
                                            ...selectedCategory,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                    placeholder="Category name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Change Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, true)}
                                    className="w-full"
                                />
                                {selectedCategory.preview && (
                                    <img
                                        src={selectedCategory.preview}
                                        alt="Preview"
                                        className="h-20 w-20 mt-3 rounded border object-cover"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 gap-3">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
