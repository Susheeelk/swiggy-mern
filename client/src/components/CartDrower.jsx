import React from "react";
import { FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../feature/cartSlice";
import { toast } from "react-toastify";

const CartDrawer = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);
    const { userData } = useSelector((state) => state.user);

    // Only show cart items for logged-in user
    const userCartItems = cartItems.filter((i) => i.userId === userData?._id);

    const handleRemove = (id) => {
        const item = cartItems.find(i => i.food._id === id);
        dispatch(removeFromCart({ foodId: id, userId: userData._id }));
        if (item) toast.error(`${item.food.name} removed from cart`);
    };

    const handleClear = () => {
        if (cartItems.length === 0) return;
        dispatch(clearCart(userData._id));
        toast.warn("Cart cleared");
    };

    const total = cartItems.reduce((sum, item) => sum + item.food.price * item.quantity, 0);

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 w-80 max-w-full h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Your Cart</h2>
                    <button onClick={onClose}>
                        <FiX size={22} />
                    </button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-8rem)]">
                    {userCartItems.length === 0 ? (
                        <p className="text-red-500">Your cart is empty.</p>
                    ) : (
                        userCartItems.map((item) => (
                            <div key={item.food._id} className="flex items-center space-x-3">
                                <img
                                    src={item.food.image}
                                    alt={item.food.name}
                                    className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium">{item.food.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {item.quantity} x ₹{item.food.price}
                                    </p>
                                </div>
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleRemove(item.food._id)}
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Buttons */}
                <div className="p-4 border-t space-y-2">
                    <Link to="/cart">
                        <button
                            onClick={onClose}
                            className={`w-full py-2 rounded-md text-white ${cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
                            disabled={cartItems.length === 0}
                        >
                            Go to Cart
                        </button>
                    </Link>

                    <button
                        onClick={handleClear}
                        className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
                        disabled={cartItems.length === 0}
                    >
                        Clear Cart
                    </button>

                    <p className="text-right text-sm text-gray-600 mt-2 font-medium">
                        Total: <span className="text-orange-500">₹{total}</span>
                    </p>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
