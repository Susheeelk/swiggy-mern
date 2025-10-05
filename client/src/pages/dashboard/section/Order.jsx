import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setOrders } from "../../../feature/orderSlice";
import axiosInstance from "../../../api/axios";

const Orders = () => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.order.orders);
    const userId = useSelector((state) => state.user.userData?._id);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) return;
            try {
                setLoading(true);
                const res = await axiosInstance.get("/orders");
                dispatch(setOrders(res.data || []));
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [dispatch, userId]);

    // ✅ Badge color based on status
    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-100 text-green-700";
            case "Cancelled":
                return "bg-red-100 text-red-700";
            case "Paid":
                return "bg-blue-100 text-blue-700";
            case "Preparing":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-yellow-100 text-gray-700"; // Pending or others
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">My Orders</h2>

            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p className="text-red-600">No orders found.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="border rounded-lg p-4 hover:shadow-md transition"
                        >
                            {/* Order ID + Status */}
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm text-gray-600">
                                    Order ID: <strong>{order._id.slice(-6)}</strong>
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                        order.status
                                    )}`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            {/* Restaurant */}
                            {order.restaurant && (
                                <div className="text-sm text-gray-800 mb-2">
                                    Restaurant: <strong>{order.restaurant.name}</strong>
                                </div>
                            )}

                            {/* Items */}
                            <ul className="list-disc ml-4 text-gray-700 text-sm mb-2">
                                {order.items.map((item) => (
                                    <li key={item.food?._id}>
                                        {item.food?.name} × {item.quantity}
                                    </li>
                                ))}
                            </ul>

                            {/* Payment Method */}
                            <div className="text-sm text-gray-700 mb-2">
                                Payment:{" "}
                                <span className="font-medium capitalize">
                                    {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                                </span>
                            </div>

                            {/* Date + Total */}
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Ordered on: {new Date(order.createdAt).toLocaleString()}</span>
                                <span className="font-semibold text-gray-900">
                                    Total: ₹{order.totalAmount}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
