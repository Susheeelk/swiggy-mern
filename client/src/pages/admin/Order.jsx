import React, { useState, useEffect } from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axios";

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [loading, setLoading] = useState(true);

    // ✅ Fetch vendor orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/orders");
            setOrders(res?.data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleView = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setNewStatus("");
    };

    // ✅ Update status API call
    const handleStatusUpdate = async () => {
        try {
            const res = await axiosInstance.put(`/orders/${selectedOrder._id}`, {
                status: newStatus,
            });

            const updatedOrders = orders.map((order) =>
                order._id === selectedOrder._id ? { ...order, status: newStatus } : order
            );
            setOrders(updatedOrders);

            toast.success(res.data.message || "Order status updated");
            closeModal();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update order");
        }
    };

    // ✅ Delete order API call
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;

        try {
            const res = await axiosInstance.delete(`/orders/${id}`);
            setOrders(orders.filter((order) => order._id !== id));
            toast.success(res.data.message || "Order deleted successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete order");
        }
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                All Orders
            </h1>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                {loading ? (
                    <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                    <p className="text-gray-600">No orders found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600 text-xs sm:text-sm">
                                    <th className="py-2 px-3 sm:px-4">Order ID</th>
                                    <th className="py-2 px-3 sm:px-4">Customer</th>
                                    <th className="py-2 px-3 sm:px-4">Items</th>
                                    <th className="py-2 px-3 sm:px-4">Amount</th>
                                    <th className="py-2 px-3 sm:px-4">Payment</th>
                                    <th className="py-2 px-3 sm:px-4">Pay. Status</th>
                                    <th className="py-2 px-3 sm:px-4">Address</th>
                                    <th className="py-2 px-3 sm:px-4">Status</th>
                                    <th className="py-2 px-3 sm:px-4">Date</th>
                                    <th className="py-2 px-3 sm:px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders?.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="py-2 px-3 sm:px-4">{order._id.slice(-6)}</td>
                                        <td className="py-2 px-3 sm:px-4">
                                            {order.user?.name || "Unknown"}
                                        </td>
                                        <td className="py-2 px-3 sm:px-4">{order.items?.length}</td>
                                        <td className="py-2 px-3 sm:px-4">₹{order.totalAmount}</td>
                                        <td className="py-2 px-3 sm:px-4">
                                            {order.paymentMethod === "COD" ? "Cash" : "Online"}
                                        </td>
                                        <td className="py-2 px-3 sm:px-4">{order.paymentStatus}</td>
                                        <td className="py-2 px-3 sm:px-4">
                                            {order.address
                                                ? `${order.address.city || ""}, ${order.address.state || ""}`
                                                : "N/A"}
                                        </td>
                                        <td className="py-2 px-3 sm:px-4">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium
                          ${order.status === "Delivered" && "bg-green-100 text-green-600"}
                          ${order.status === "Pending" && "bg-yellow-100 text-yellow-600"}
                          ${order.status === "Cancelled" && "bg-red-100 text-red-600"}
                          ${order.status === "Paid" && "bg-blue-100 text-blue-600"}
                          ${order.status === "Preparing" && "bg-orange-100 text-orange-600"}
                        `}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-3 sm:px-4 text-center flex gap-3 justify-center">
                                            <button
                                                onClick={() => handleView(order)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FiEye />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(order._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ✅ Responsive Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-3">
                    <div className="bg-white w-full sm:w-[400px] max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6 shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                        <p>
                            <strong>Order ID:</strong> {selectedOrder._id.slice(-6)}
                        </p>
                        <p>
                            <strong>Customer:</strong>{" "}
                            {selectedOrder.user?.name || "Unknown"}
                        </p>
                        <p>
                            <strong>Items:</strong>{" "}
                            {selectedOrder.items
                                .map((i) => `${i.food?.name} × ${i.quantity}`)
                                .join(", ")}
                        </p>
                        <p>
                            <strong>Amount:</strong> ₹{selectedOrder.totalAmount}
                        </p>
                        <p>
                            <strong>Payment:</strong>{" "}
                            {selectedOrder.paymentMethod === "COD"
                                ? "Cash on Delivery"
                                : "Online"}{" "}
                            ({selectedOrder.paymentStatus})
                        </p>
                        {selectedOrder.address && (
                            <p>
                                <strong>Address:</strong>{" "}
                                {`${selectedOrder.address.houseNo || ""}, ${selectedOrder.address.street || ""}, ${selectedOrder.address.city || ""}, ${selectedOrder.address.state || ""} - ${selectedOrder.address.pincode || ""}`}
                            </p>
                        )}
                        <p>
                            <strong>Date:</strong>{" "}
                            {new Date(selectedOrder.createdAt).toLocaleString()}
                        </p>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-1">
                                Update Status
                            </label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full border rounded px-3 py-2 text-sm"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
                            <button
                                onClick={closeModal}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusUpdate}
                                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm"
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

export default AdminOrdersPage;
