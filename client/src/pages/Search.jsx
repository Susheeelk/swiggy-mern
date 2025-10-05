import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const SearchPage = () => {
    const { restaurants } = useSelector((state) => state.restaurant);

    // URL से query निकालना
    const { search } = useLocation();
    const query = new URLSearchParams(search).get("q") || "";

    // Filter restaurants by query
    const filtered = restaurants.filter(
        (r) =>
            r.name.toLowerCase().includes(query.toLowerCase()) ||
            r.categories?.some((c) =>
                c.name.toLowerCase().includes(query.toLowerCase())
            )
    );

    return (
        <div className="pt-20 mx-auto max-w-6xl px-4">
            <h1 className="text-2xl font-semibold mb-4">
                Search Results for "{query}"
            </h1>

            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filtered.map((restaurant) => (
                        <Link
                            key={restaurant._id}
                            to={`/restaurant/${restaurant._id}`}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition"
                        >
                            <img
                                src={restaurant.image}
                                alt={restaurant.name}
                                className="w-full h-40 object-cover rounded-t-lg"
                            />
                            <div className="p-3">
                                <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {restaurant.categories?.map((c) => c.name).join(", ")}
                                </p>
                                <p className="text-sm text-gray-600">{restaurant.address}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No restaurants found.</p>
            )}
        </div>
    );
};

export default SearchPage;
