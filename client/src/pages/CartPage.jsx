import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiTrash2 } from "react-icons/fi";
import { removeFromCart, increaseQty, decreaseQty, clearCart } from "../feature/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const dispatch = useDispatch();
    const nevagitor = useNavigate()
    const { cartItems } = useSelector((state) => state.cart);
    const { userData } = useSelector((state) => state.user);

    if (!userData) {
        return (
            <div className="min-h-screen pt-24 px-4 text-center text-red-500">
                Please login to see your cart.
            </div>
        );
    }


    // Filter cart items for logged-in user only
    const userCartItems = cartItems.filter((i) => i.userId === userData._id);


    const handleQuantityChange = (id, type) => {
        if (type === "inc") dispatch(increaseQty({ id, userId: userData._id }));
        else dispatch(decreaseQty({ id, userId: userData._id }));
    };

    const handleRemove = (id) => {
        const item = userCartItems.find((i) => i.food._id === id);
        dispatch(removeFromCart({ foodId: id, userId: userData._id }));
        if (item) toast.error(`${item.food.name} removed from cart`);
    };

    const handleClear = () => {
        dispatch(clearCart(userData._id));
        toast.warn("Cart cleared");
    };

    const total = userCartItems.reduce((sum, item) => sum + item.food.price * item.quantity, 0);

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-16 bg-gray-50">
            <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

            {userCartItems.length === 0 ? (
                <p className="text-red-600">Your cart is empty.</p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {userCartItems.map((item) => (
                            <div key={item.food._id} className="flex flex-col sm:flex-row items-center bg-white rounded-lg shadow p-4 gap-4">
                                <img src={item.food.image} alt={item.food.name} className="w-24 h-24 object-cover rounded" />
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-lg font-semibold">{item.food.name}</h3>
                                    <p className="text-orange-500 font-medium">₹{item.food.price}</p>
                                    <div className="flex items-center justify-center sm:justify-start mt-2 gap-2">
                                        <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => handleQuantityChange(item.food._id, "dec")}>-</button>
                                        <span className="px-3">{item.quantity}</span>
                                        <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => handleQuantityChange(item.food._id, "inc")}>+</button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <p className="font-medium text-gray-700">₹{item.food.price * item.quantity}</p>
                                    <button className="text-red-500 hover:text-red-700" onClick={() => handleRemove(item.food._id)}>
                                        <FiTrash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="bg-white rounded-lg shadow p-6 h-fit">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                        <div className="flex justify-between text-gray-600 mb-2">
                            <span>Items:</span>
                            <span>{cartItems.length}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 mb-4">
                            <span>Total:</span>
                            <span className="font-bold text-orange-500">₹{total}</span>
                        </div>

                        {/* Proceed to Checkout button disabled if cart is empty */}
                        {userData ? (<button
                            onClick={() => nevagitor("/checkout")}
                            className={`w-full py-2 rounded-md text-white ${cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
                            disabled={cartItems.length === 0}
                        >
                            Proceed to Checkout
                        </button>) :
                            (
                                <button
                                    onClick={handleClear}
                                    className="w-full mt-3 bg-red-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
                                    disabled
                                >
                                    Please Login
                                </button>
                            )}

                        <button
                            onClick={handleClear}
                            className="w-full mt-3 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
                            disabled={cartItems.length === 0}
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
