import React, { useEffect, useState } from "react";
import { FiUsers, FiTruck, FiShoppingCart, FiDollarSign } from "react-icons/fi";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const VendorDashboards = () => {
    const [stats, setStats] = useState({
        foods: 0,
        restaurants: 0,
        orders: 0,
        revenue: 0,
    });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [monthlyData, setMonthlyData] = useState([]);

    const getStatusColor = (status) => {
        if (status === "Delivered") return "bg-green-100 text-green-600";
        if (status === "Pending") return "bg-yellow-100 text-yellow-600";
        if (status === "Cancelled") return "bg-red-100 text-red-600";
        if (status === "Paid") return "bg-blue-100 text-blue-600";
        if (status === "Preparing") return "bg-orange-100 text-orange-600";
        return "bg-gray-100 text-gray-600";
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // ✅ Vendor stats
                const statsRes = await axiosInstance.get("/vendor/stats");
                setStats(statsRes.data);

                // ✅ Recent orders
                const ordersRes = await axiosInstance.get("/vendor/orders?limit=20");
                setOrders(ordersRes.data);

                // ✅ Prepare monthly sales data
                const salesData = Array.from({ length: 12 }, (_, i) => ({
                    month: new Date(0, i).toLocaleString("default", { month: "short" }),
                    revenue: 0,
                }));

                ordersRes.data.forEach((order) => {
                    if (order.status === "Delivered") {
                        const monthIndex = new Date(order.createdAt).getMonth();
                        salesData[monthIndex].revenue += order.totalAmount;
                    }
                });

                setMonthlyData(salesData);
            } catch (err) {
                console.error(err);
                toast.error(err.response?.data?.message || "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const statsCards = [
        { title: "Total Foods", value: stats.foods, icon: <FiUsers className="text-3xl text-blue-500" /> },
        { title: "Total Restaurants", value: stats.restaurants, icon: <FiTruck className="text-3xl text-green-500" /> },
        { title: "Total Orders", value: stats.orders, icon: <FiShoppingCart className="text-3xl text-orange-500" /> },
        { title: "Total Revenue", value: `₹${stats.revenue}`, icon: <FiDollarSign className="text-3xl text-yellow-500" /> },
    ];

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">Vendor Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, idx) => (
                    <div key={idx} className="bg-white shadow-sm rounded-xl p-4 flex items-center gap-4">
                        {stat.icon}
                        <div>
                            <h3 className="text-sm text-gray-500">{stat.title}</h3>
                            <p className="text-xl font-semibold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Monthly Sales Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Monthly Sales Overview</h2>
                {loading ? (
                    <p>Loading chart...</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => `₹${value}`} />
                            <Line type="monotone" dataKey="revenue" stroke="#FF7F50" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : orders.length === 0 ? (
                    <p className="text-gray-500">No orders found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600">
                                    <th className="py-2 px-4">Order ID</th>
                                    <th className="py-2 px-4">Customer</th>
                                    <th className="py-2 px-4">Restaurant</th>
                                    <th className="py-2 px-4">Amount</th>
                                    <th className="py-2 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className="border-b hover:bg-gray-50">
                                        <td className="py-2 px-4">{order._id.slice(-6)}</td>
                                        <td className="py-2 px-4">{order.user?.name || "Unknown"}</td>
                                        <td className="py-2 px-4">{order.restaurant?.name || "Unknown"}</td>
                                        <td className="py-2 px-4">₹{order.totalAmount}</td>
                                        <td className="py-2 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorDashboards;
