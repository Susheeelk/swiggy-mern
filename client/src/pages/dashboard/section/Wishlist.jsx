import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromWishlist, clearWishlist } from "../../../feature/wishlistSlice";
import { addToCart } from "../../../feature/cartSlice";
import { toast } from "react-toastify";

const Wishlist = () => {
    const dispatch = useDispatch();
    const { wishlistItems } = useSelector((state) => state.wishlist);

    const handleRemove = (id) => {
        const item = wishlistItems.find(i => i._id === id);
        dispatch(removeFromWishlist(id));
        toast.error(`${item.name} removed from wishlist`);
    };

    const handleAddToCart = (item) => {
        dispatch(addToCart({ food: item, quantity: 1 }));
        dispatch(removeFromWishlist(item._id));
        toast.success(`${item.name} added to cart`);
    };

    const handleClearWishlist = () => {
        dispatch(clearWishlist());
        toast.warn("Wishlist cleared");
    };

    return (
        <div className="bg-white shadow-sm rounded-lg p-6 min-h-[70vh]">
            <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>

            {wishlistItems.length === 0 ? (
                <div className="text-center text-red-600 py-12">
                    <p>No items in wishlist.</p>
                    <Link
                        to="/"
                        className="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                    >
                        Browse Foods
                    </Link>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                        {wishlistItems.map((item) => (
                            <div
                                key={item._id}
                                className="border rounded p-3 shadow hover:shadow-md transition flex flex-col"
                            >
                                <Link to={`/food/${item._id}`}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                    <h3 className="mt-2 font-medium text-sm truncate">{item.name}</h3>
                                    <p className="text-gray-500 text-sm truncate">₹{item.price}</p>
                                </Link>

                                <div className="mt-auto flex gap-2 justify-between">
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600 transition flex-1"
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => handleRemove(item._id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition flex-1"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <span className="text-gray-700 font-medium">
                            Total Items: {wishlistItems.length}
                        </span>
                        <button
                            onClick={handleClearWishlist}
                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                        >
                            Clear Wishlist
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Wishlist;
