// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import { combineReducers } from "redux";
import userReducer from "../feature/userSlice";
import restaurantReducer from "../feature/restaurantSlice";
import foodReducer from "../feature/foodSlice";
import categoryReducer from "../feature/categorySlice";
import addressReducer from "../feature/addressSlice";
import orderReducer from "../feature/orderSlice";
import cartReducer from "../feature/cartSlice";
import wishlistReducer from "../feature/wishlistSlice";

// 1️⃣ Combine all reducers
const rootReducer = combineReducers({
    user: userReducer,
    restaurant: restaurantReducer,
    food: foodReducer,
    category: categoryReducer,
    address: addressReducer,
    order: orderReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
});

// 2️⃣ Configure persist
const persistConfig = {
    key: "root", // localStorage me key
    storage,     // storage type
    whitelist: ["user", "cart", "wishlist"], // sirf ye slices persist honge, baaki refresh pe reset
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3️⃣ Configure store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // redux-persist ke liye required
        }),
});

export const persistor = persistStore(store);
export default store;
