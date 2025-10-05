import React, { useState } from "react";
import CategoryPage from "./Category";
import RestaurantPage from "./Restaurent";
import RestaurantGridPage from "./Restaurents";

const HomePage = () => {
    const [activeCategoryId, setActiveCategoryId] = useState(null);

    return (
        <div className="pt-16"> {/* offset for fixed Navbar */}
            {/* Category Carousel */}
            <CategoryPage
                activeCategoryId={activeCategoryId}
                setActiveCategoryId={setActiveCategoryId}
            />

            {/* Top Picks Section */}
            <section className="mx-auto max-w-7xl px-4 py-6 border-b border-gray-200">
                <RestaurantPage categoryId={activeCategoryId} />
            </section>

            {/* All Restaurants Grid */}
            <section className="mx-auto max-w-7xl px-4 py-6">
                <RestaurantGridPage />
            </section>
        </div>
    );
};

export default HomePage;
