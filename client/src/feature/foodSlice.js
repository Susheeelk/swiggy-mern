import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axios";

// Initial state
const initialState = {
    foods: [],
    loading: false,
    error: null,
};

// Slice
const foodSlice = createSlice({
    name: "food",
    initialState,
    reducers: {
        setFoods: (state, action) => {
            state.foods = action.payload;
        },
        setFood: (state, action) => {
            state.foods = action.payload;
        },
        addFood: (state, action) => {
            state.foods.push(action.payload);
        },
        updateFood: (state, action) => {
            const index = state.foods.findIndex((f) => f._id === action.payload._id);
            if (index !== -1) state.foods[index] = action.payload;
        },
        deleteFood: (state, action) => {
            state.foods = state.foods.filter((f) => f._id !== action.payload);
        },
    },
});

export const { setFoods, setFood, addFood, updateFood, deleteFood } = foodSlice.actions;
export default foodSlice.reducer;

// ------------------- Thunks -------------------

// Fetch all foods
export const fetchFoods = () => async (dispatch) => {
    try {
        const res = await axiosInstance.get("/foods");
        dispatch(setFoods(res.data));
    } catch (err) {
        console.error(err);
    }
};


// fetch food to create userid
export const fetchFood = () => async (dispatch) => {
    try {
        const res = await axiosInstance.get("/foods/id");
        dispatch(setFood(res.data));
    } catch (err) {
        console.error(err);
    }
};

// Create food
export const createFoodThunk = (formData) => async (dispatch) => {
    try {
        const res = await axiosInstance.post("/foods", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        dispatch(addFood(res.data));
    } catch (err) {
        console.error(err);
    }
};

// Update food
export const updateFoodThunk = (id, formData) => async (dispatch) => {
    try {
        const res = await axiosInstance.put(`/foods/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        dispatch(updateFood(res.data));
    } catch (err) {
        console.error(err);
    }
};

// Delete food
export const deleteFoodThunk = (id) => async (dispatch) => {
    try {
        await axiosInstance.delete(`/foods/${id}`);
        dispatch(deleteFood(id));
    } catch (err) {
        console.error(err);
    }
};
