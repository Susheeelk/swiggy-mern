import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: [],
    },
    reducers: {
        addToCart: (state, action) => {
            const { food, quantity } = action.payload;

            if (!food || quantity <= 0) return; // 🛡 Safety check

            const existing = state.cartItems.find(item => item.food._id === food._id);
            if (existing) {
                existing.quantity += quantity;
            } else {
                state.cartItems.push({ food, quantity });
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item.food._id !== action.payload);
        },
        clearCart: (state) => {
            state.cartItems = [];
        },
        increaseQty: (state, action) => {
            const item = state.cartItems.find(i => i.food._id === action.payload);
            if (item) item.quantity++;
        },
        decreaseQty: (state, action) => {
            const item = state.cartItems.find(i => i.food._id === action.payload);
            if (item && item.quantity > 1) item.quantity--;
        },
    },
});

export const { addToCart, removeFromCart, clearCart, increaseQty, decreaseQty } = cartSlice.actions;
export default cartSlice.reducer;
