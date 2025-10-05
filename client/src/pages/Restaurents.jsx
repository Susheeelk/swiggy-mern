import React from "react";
import { useNavigate } from "react-router-dom";

const restaurants = [
    {
        id: 1,
        name: "Spicy Villa",
        image: "https://images.unsplash.com/photo-1555992336-03a23c8b5f49?crop=entropy&cs=tinysrgb&fit=crop&h=200&w=300",
        cuisine: "Indian, Chinese",
        rating: "4.2",
        deliveryTime: "30 mins",
    },
    {
        id: 2,
        name: "Burger Hub",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=crop&h=200&w=300",
        cuisine: "Burgers, Fast Food",
        rating: "4.5",
        deliveryTime: "25 mins",
    },
    {
        id: 3,
        name: "Biryani House",
        image: "https://images.unsplash.com/photo-1611171711914-1d1c169aebf6?crop=entropy&cs=tinysrgb&fit=crop&h=200&w=300",
        cuisine: "Biryani, Mughlai",
        rating: "4.0",
        deliveryTime: "35 mins",
    },
    {
        id: 4,
        name: "Sushi Bar",
        image: "https://images.unsplash.com/photo-1598511724813-d58e7d7789bc?crop=entropy&cs=tinysrgb&fit=crop&h=200&w=300",
        cuisine: "Japanese, Sushi",
        rating: "4.3",
        deliveryTime: "40 mins",
    },
    {
        id: 5,
        name: "Pizza Palace",
        image: "https://images.unsplash.com/photo-1548365328-8b1f99fa0e93?crop=entropy&cs=tinysrgb&fit=crop&h=200&w=300",
        cuisine: "Pizza, Italian",
        rating: "4.4",
        deliveryTime: "28 mins",
    }
];

const RestaurantGridPage = () => {
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/restaurant/${id}`);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 pt-20">
            {/* Heading */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6">
                Explore Restaurants
            </h2>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant.id}
                        className="bg-white rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
                        onClick={() => handleClick(restaurant.id)}
                    >
                        <div className="w-full h-36 sm:h-40 md:h-48">
                            <img
                                src={restaurant.image}
                                alt={restaurant.name}
                                loading="lazy"
                                className="w-full h-full object-cover rounded-t-lg"
                            />
                        </div>
                        <div className="p-3">
                            <h3 className="text-sm sm:text-base font-semibold truncate">
                                {restaurant.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                                {restaurant.cuisine}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs sm:text-sm font-medium bg-green-500 text-white px-2 py-0.5 rounded">
                                    ⭐ {restaurant.rating}
                                </span>
                                <span className="text-xs sm:text-sm text-gray-600">
                                    {restaurant.deliveryTime}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantGridPage;
