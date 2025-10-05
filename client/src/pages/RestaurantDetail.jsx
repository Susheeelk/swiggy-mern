import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiStar, FiClock, FiMapPin } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../api/axios"
import { addToCart } from "../feature/cartSlice";
import { toast } from "react-toastify";

const RestaurantDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);

    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurantAndFoods = async () => {
            try {
                setLoading(true);

                // Fetch restaurant details
                const res = await axiosInstance.get(`/restaurant/${id}`);
                setRestaurant(res.data);


                // Fetch all foods and filter by restaurant ID
                const foodsRes = await axiosInstance.get("/foods");
                const restaurantFoods = foodsRes.data.filter(
                    (f) => f.restaurant._id === id
                );
                setFoods(restaurantFoods);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantAndFoods();
    }, [id]);

    const handleAddToCart = (food) => {
        dispatch(addToCart({ food, quantity: 1 }));
        toast.success("Added to cart");
    };


    // check if already exist 
    const isInCart = (foodId) =>
        cartItems.some((item) => item.food._id === foodId);

    if (loading) return <div className="pt-24 text-center">Loading...</div>;
    if (!restaurant) return <div className="pt-24 text-center text-gray-600">Restaurant Not Found</div>;

    return (
        <div className="pt-24 px-4 sm:px-6 lg:px-24 max-w-7xl mx-auto">
            {/* Restaurant Info */}
            <div className="mb-6 border-b pb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{restaurant.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2 flex-wrap">
                    <span className="flex items-center gap-1"><FiStar className="text-yellow-500" /> {restaurant.rating || "N/A"}</span>
                    <span className="flex items-center gap-1"><FiClock /> {restaurant.time || "N/A"}</span>
                    <span className="flex items-center gap-1"><FiMapPin /> {restaurant.address || "N/A"}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{restaurant.tags || ""}</p>
            </div>

            {/* Food Items */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {foods.map((item) => (
                    <div key={item._id} className="bg-white shadow-sm hover:shadow-lg rounded-lg overflow-hidden transition-all duration-200">
                        <img src={item.image} alt={item.name} className="w-full h-44 object-cover" />
                        <div className="p-4">
                            <h2 className="text-base md:text-lg font-semibold text-gray-800">{item.name}</h2>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                            <div className="mt-3 flex justify-between items-center">
                                <span className="text-orange-500 font-bold text-sm">₹{item.price}</span>
                                {isInCart(item._id) ? (
                                    <button
                                        disabled
                                        className="bg-gray-400 text-white text-sm px-3 py-1 rounded cursor-not-allowed"
                                    >
                                        Added
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1 rounded"
                                    >
                                        ADD
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantDetails;
