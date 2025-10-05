import React, { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../feature/categorySlice";

const CategoryPage = ({ activeCategoryId, setActiveCategoryId }) => {
    const dispatch = useDispatch();
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const { categories } = useSelector((state) => state.category);

    useEffect(() => {
        dispatch(fetchCategories());
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

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 pt-[5rem] border-b border-gray-200">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold">What's on your mind?</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => scroll("left")}
                            disabled={!canScrollLeft}
                            className="p-2 rounded-full bg-gray-100 disabled:opacity-50"
                        >
                            <FiChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            disabled={!canScrollRight}
                            className="p-2 rounded-full bg-gray-100 disabled:opacity-50"
                        >
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Categories */}
                <div
                    ref={scrollRef}
                    className="flex justify-center space-x-4 overflow-x-auto pb-2 px-4 sm:px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    {categories?.map((category, index) => (
                        <div
                            key={category.id}
                            onClick={() => setActiveCategoryId(category._id)}
                            className={`flex flex-col items-center min-w-[70px] sm:min-w-[90px] cursor-pointer
                            ${activeCategoryId === category._id ? "text-orange-500 font-semibold" : "hover:text-orange-500"}
                            ${index === 0 ? "ml-5 sm:ml-6" : ""}`}
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className={`w-14 h-14 sm:w-20 sm:h-20 object-cover rounded-full border shadow
                                ${activeCategoryId === category.id ? "ring-8 ring-orange-500" : ""}`}
                            />
                            <span className="mt-2 text-xs sm:text-sm">{category.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
