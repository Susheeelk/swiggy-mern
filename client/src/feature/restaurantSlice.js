import { createSlice } from "@reduxjs/toolkit";

const restaurantSlice = createSlice({
    name: "restaurant",
    initialState: {
        restaurants: [],
    },
    reducers: {
        setRestaurants: (state, action) => {
            state.restaurants = action.payload;
        },
        setRestaurant: (state, action) => {
            state.restaurants = action.payload;
        },
        addRestaurant: (state, action) => {
            state.restaurants.push(action.payload);
        },
        updateRestaurant: (state, action) => {
            const index = state.restaurants.findIndex(r => r._id === action.payload._id);
            if (index !== -1) state.restaurants[index] = action.payload;
        },
        deleteRestaurant: (state, action) => {
            state.restaurants = state.restaurants.filter(r => r._id !== action.payload);
        },
    },
});

export const { setRestaurants, addRestaurant, setRestaurant, updateRestaurant, deleteRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
