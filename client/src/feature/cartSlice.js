import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: [],
    },
    reducers: {
        addToCart: (state, action) => {
            const { food, quantity, userId } = action.payload;
            if (!userId) return;
            if (!food || quantity <= 0) return; // 🛡 Safety check

            const existing = state.cartItems.find(item => item.food._id === food._id && item.userId === userId);
            if (existing) {
                existing.quantity += quantity;
            } else {
                state.cartItems.push({ food, quantity, userId });
            }
        },
        removeFromCart: (state, action) => {
            const { foodId, userId } = action.payload
            state.cartItems = state.cartItems.filter(
                (item) => !(item.food._id == foodId && item.userId === userId)
            );
        },
        clearCart: (state, action) => {
            const userId = action.payload
            state.cartItems = state.cartItems.filter((i) => i.userId !== userId);
        },
        increaseQty: (state, action) => {
            const item = state.cartItems.find(i => i.food._id === action.payload && i.userId === action.payload);
            if (item) item.quantity++;
        },
        decreaseQty: (state, action) => {
            const item = state.cartItems.find(i => i.food._id === action.payload && i.userId === action.payload);
            if (item && item.quantity > 1) item.quantity--;
        },
    },
});

export const { addToCart, removeFromCart, clearCart, increaseQty, decreaseQty } = cartSlice.actions;
export default cartSlice.reducer;
