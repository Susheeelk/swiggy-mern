import React, { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurants } from "../feature/Action/restaurantActions";

const RestaurantPage = ({ categoryId }) => {
    const scrollRef = useRef(null);
    const dispatch = useDispatch();
    const { restaurants } = useSelector((state) => state.restaurant);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // 🔹 Load all restaurants only once
    useEffect(() => {
        dispatch(fetchRestaurants());
    }, [dispatch]);

    const checkScrollPosition = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.7;
            scrollRef.current.scrollTo({
                left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        const scroller = scrollRef.current;
        if (scroller) {
            checkScrollPosition();
            scroller.addEventListener("scroll", checkScrollPosition);
            window.addEventListener("resize", checkScrollPosition);
        }
        return () => {
            if (scroller) {
                scroller.removeEventListener("scroll", checkScrollPosition);
                window.removeEventListener("resize", checkScrollPosition);
            }
        };
    }, []);

    // 🔹 Filter restaurants by category
    const filteredRestaurants = categoryId
        ? restaurants.filter((restaurant) =>
            restaurant.categories?.some((c) => c._id === categoryId) // match categoryId
        )
        : restaurants;

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 pt-15">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
                    {categoryId ? "Restaurants by Category" : "Top Picks For You"}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className="p-2 sm:p-3 rounded-full bg-gray-100 disabled:opacity-50"
                    >
                        <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className="p-2 sm:p-3 rounded-full bg-gray-100 disabled:opacity-50"
                    >
                        <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex space-x-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map((restaurant, index) => (
                        <Link
                            key={restaurant._id}
                            to={`/restaurant/${restaurant._id}`}
                            className={`min-w-[200px] sm:min-w-[240px] md:min-w-[260px] bg-white rounded-lg shadow
                            hover:shadow-lg transition
                            ${index === 0 ? "ml-4 sm:ml-6" : ""} ${index === filteredRestaurants.length - 1 ? "mr-4 sm:mr-6" : ""}`}
                        >
                            <div className="w-full h-36 sm:h-40 md:h-48">
                                <img
                                    src={restaurant.image}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover rounded-t-lg"
                                />
                            </div>
                            <div className="p-3">
                                <h3 className="text-sm sm:text-base font-semibold truncate">{restaurant.name}</h3>
                                <p className="text-xs sm:text-sm text-gray-500 truncate">
                                    {restaurant.categories?.map((c) => c.name).join(", ")}
                                </p>
                                <p className="text-xs sm:text-sm text-blue-500 truncate">{restaurant.address.slice(0, 30)} . . . . .</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs sm:text-sm font-medium bg-green-500 text-white px-2 py-0.5 rounded">
                                        ⭐ {restaurant.rating || "4.0"}
                                    </span>
                                    <span className="text-xs sm:text-sm text-gray-600">{restaurant.deliveryTime || "30 mins"}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-gray-500">No restaurants available</p>
                )}
            </div>
        </div>
    );
};

export default RestaurantPage;
