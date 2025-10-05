import React from "react";
import {
    FiUsers,
    FiTruck,
    FiShoppingCart,
    FiDollarSign,
} from "react-icons/fi";

const Dashboard = () => {
    const stats = [
        {
            title: "Total Users",
            value: "1,204",
            icon: <FiUsers className="text-3xl text-blue-500" />,
        },
        {
            title: "Total Vendors",
            value: "102",
            icon: <FiTruck className="text-3xl text-green-500" />,
        },
        {
            title: "Total Orders",
            value: "8,342",
            icon: <FiShoppingCart className="text-3xl text-orange-500" />,
        },
        {
            title: "Total Revenue",
            value: "₹2,30,540",
            icon: <FiDollarSign className="text-3xl text-yellow-500" />,
        },
    ];

    const orders = [
        { id: "ORD123", customer: "Ravi Kumar", amount: "₹450", status: "Delivered" },
        { id: "ORD124", customer: "Priya Shah", amount: "₹320", status: "Pending" },
        { id: "ORD125", customer: "Ankit Verma", amount: "₹990", status: "Cancelled" },
    ];

    const getStatusColor = (status) => {
        if (status === "Delivered") return "bg-green-100 text-green-600";
        if (status === "Pending") return "bg-yellow-100 text-yellow-600";
        if (status === "Cancelled") return "bg-red-100 text-red-600";
        return "";
    };

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="bg-white shadow-sm rounded-xl p-4 flex items-center gap-4"
                    >
                        {stat.icon}
                        <div>
                            <h3 className="text-sm text-gray-500">{stat.title}</h3>
                            <p className="text-xl font-semibold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Placeholder */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Monthly Sales Overview</h2>
                <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-md">
                    Chart Placeholder
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600">
                                <th className="py-2 px-4">Order ID</th>
                                <th className="py-2 px-4">Customer</th>
                                <th className="py-2 px-4">Amount</th>
                                <th className="py-2 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-4">{order.id}</td>
                                    <td className="py-2 px-4">{order.customer}</td>
                                    <td className="py-2 px-4">{order.amount}</td>
                                    <td className="py-2 px-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
