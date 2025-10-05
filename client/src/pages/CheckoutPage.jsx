import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { clearCart } from "../feature/cartSlice";
import { toast } from "react-toastify";

const CheckoutPage = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state);
    const [addresses, setAddresses] = useState([]); // ✅ address state
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState("COD");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const totalAmount = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.food.price,
        0
    );

    // ✅ Fetch addresses from backend
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const { data } = await api.get("/address");
                setAddresses(data);
            } catch (error) {
                console.error("Failed to fetch addresses", error);
            }
        };
        fetchAddresses();
    }, []);

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            toast.error("Please select an address");
            return;
        }

        try {
            const payload = {
                items: cartItems.map((item) => ({
                    food: item.food._id,
                    quantity: item.quantity,
                    price: item.food.price,
                })),
                restaurant: cartItems[0]?.food.restaurant,
                address: selectedAddressId,
                paymentMethod: selectedPayment,
            };

            const { data } = await api.post("/orders", payload);

            if (selectedPayment === "COD") {
                dispatch(clearCart());
                navigate("/order-success");
            } else if (selectedPayment === "Online" && data.redirectUrl) {
                window.location.href = data.redirectUrl;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to place order");
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            {/* Address Selection */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-lg font-semibold mb-2">Select Delivery Address</h2>
                {addresses.length > 0 ? (
                    addresses.map((addr) => (
                        <label
                            key={addr._id}
                            className="flex items-center gap-3 border p-3 rounded cursor-pointer mb-2"
                        >
                            <input
                                type="radio"
                                name="address"
                                value={addr._id}
                                checked={selectedAddressId === addr._id}
                                onChange={() => setSelectedAddressId(addr._id)}
                            />
                            <span>
                                {addr.house}, {addr.area}, {addr.landmark},{addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                            </span>
                        </label>
                    ))
                ) : (
                    <p>No saved addresses. Please add one in Profile.</p>
                )}
            </div>

            {/* Payment Section */}
            <div className="bg-white p-6 rounded-lg shadow space-y-4 mb-6">
                <h2 className="text-lg font-semibold mb-2">Payment Method</h2>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={selectedPayment === "COD"}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                    />
                    Cash on Delivery
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="radio"
                        name="payment"
                        value="Online"
                        checked={selectedPayment === "Online"}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                    />
                    Debit / Credit Card
                </label>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
                <ul className="divide-y">
                    {cartItems.map((item) => (
                        <li key={item.food._id} className="flex justify-between py-2">
                            <span>
                                {item.food.name} × {item.quantity}
                            </span>
                            <span>${item.food.price * item.quantity}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between font-bold mt-4">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                </div>
            </div>

            {/* Place Order Button */}
            <button
                onClick={handlePlaceOrder}
                className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
                Place Order
            </button>
        </div>
    );
};

export default CheckoutPage;
