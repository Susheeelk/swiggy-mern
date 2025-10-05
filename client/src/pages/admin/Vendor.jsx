import React, { useState } from "react";
import { FiEye, FiTrash2, FiX } from "react-icons/fi";
import { MdBlock } from "react-icons/md";

const Vendor = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const users = [
        { id: 1, name: "Ravi Kumar", email: "ravi@example.com", role: "Customer", status: "Active" },
        { id: 2, name: "Priya Sharma", email: "priya@example.com", role: "Vendor", status: "Inactive" },
        { id: 3, name: "Ankit Verma", email: "ankit@example.com", role: "Customer", status: "Active" },
    ];

    const getStatusClass = (status) => {
        if (status === "Active") return "bg-green-100 text-green-700";
        if (status === "Inactive") return "bg-red-100 text-red-700";
        return "bg-gray-100 text-gray-700";
    };

    const openUserModal = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const closeUserModal = () => {
        setShowUserModal(false);
        setSelectedUser(null);
    };

    const openDeleteModal = (user) => {
        setUserToDelete(user);
    };

    const confirmDelete = () => {
        alert(`User "${userToDelete.name}" deleted.`);
        setUserToDelete(null);
    };

    const cancelDelete = () => {
        setUserToDelete(null);
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">Users</h1>

            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600">
                            <th className="px-4 py-2">#</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Role</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, i) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{i + 1}</td>
                                <td className="px-4 py-2">{user.name}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{user.role}</td>
                                <td className="px-4 py-2">
                                    <span className={`px-2 py-1 text-xs rounded ${getStatusClass(user.status)}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2 flex gap-2">
                                    <button
                                        className="text-blue-600 hover:text-blue-800"
                                        onClick={() => openUserModal(user)}
                                    >
                                        <FiEye />
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => openDeleteModal(user)}
                                    >
                                        <FiTrash2 />
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => openDeleteModal(user)}
                                    >
                                        <MdBlock />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View User Modal */}
            {showUserModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl w-96 p-6 shadow-lg relative">
                        <button className="absolute top-3 right-3 text-gray-500" onClick={closeUserModal}>
                            <FiX className="text-xl" />
                        </button>
                        <h2 className="text-lg font-semibold mb-4">User Details</h2>
                        <p><strong>Name:</strong> {selectedUser.name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Role:</strong> {selectedUser.role}</p>
                        <p><strong>Status:</strong> {selectedUser.status}</p>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {userToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl w-96 p-6 shadow-lg relative">
                        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete user <strong>{userToDelete.name}</strong>?</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vendor;
