import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        wishlistItems: [],
    },
    reducers: {
        addToWishlist: (state, action) => {
            if (!state.wishlistItems.find(item => item._id === action.payload._id)) {
                state.wishlistItems.push(action.payload);
            }
        },
        removeFromWishlist: (state, action) => {
            state.wishlistItems = state.wishlistItems.filter(item => item._id !== action.payload);
        },
        clearWishlist: (state) => {
            state.wishlistItems = [];
        },
    },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
