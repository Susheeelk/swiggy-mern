import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { clearCart } from "../feature/cartSlice";
import { toast } from "react-toastify";

const OrderSuccessPage = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyPayment = async () => {
            const queryParams = new URLSearchParams(location.search);
            const sessionId = queryParams.get("session_id"); // ✅ Stripe se aata hai

            if (sessionId) {
                try {
                    const { data } = await api.post("/payments/verify", { sessionId });

                    if (data.success) {
                        dispatch(clearCart());
                        toast.success("Payment successful! Order confirmed.");
                    } else {
                        toast.error("Payment verification failed!");
                    }
                } catch (err) {
                    toast.error("Error verifying payment.", err);
                }
            } else {
                // ✅ COD case: cart clear yahi kar do
                dispatch(clearCart());
                toast.success("Order placed successfully with COD.");
            }
        };

        verifyPayment();
    }, [location, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
                    alt="Success"
                    className="w-24 mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                    Order Placed Successfully!
                </h2>
                <p className="text-gray-600 mb-6">
                    Thank you for your order. You can track your delivery in the Orders
                    section.
                </p>
                <Link
                    to="/dashboard/orders"
                    className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition"
                >
                    View My Orders
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
