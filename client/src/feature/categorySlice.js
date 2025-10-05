import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axios"

const categorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        addCategory: (state, action) => {
            state.categories.push(action.payload);
        },
        updateCategory: (state, action) => {
            const index = state.categories.findIndex(c => c._id === action.payload._id);
            if (index !== -1) state.categories[index] = action.payload;
        },
        deleteCategory: (state, action) => {
            state.categories = state.categories.filter(c => c._id !== action.payload);
        },
    },
});

export const { setLoading, setError, setCategories, addCategory, updateCategory, deleteCategory } =
    categorySlice.actions;

// ---------------------------
// ✅ Async Functions (API Calls)
// ---------------------------

// get all categories
export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { data } = await axiosInstance.get("/category");

        dispatch(setCategories(data.categories));
    } catch (error) {
        dispatch(setError(error.response?.data?.message || "Failed to fetch categories"));
    } finally {
        dispatch(setLoading(false));
    }
};

// create category
export const createCategory = (formData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { data } = await axiosInstance.post("/category", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        dispatch(addCategory(data));
    } catch (error) {
        dispatch(setError(error.response?.data?.message || "Failed to create category"));
    } finally {
        dispatch(setLoading(false));
    }
};

// update category
export const editCategory = (id, formData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { data } = await axiosInstance.put(`/category/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        dispatch(updateCategory(data));
    } catch (error) {
        dispatch(setError(error.response?.data?.message || "Failed to update category"));
    } finally {
        dispatch(setLoading(false));
    }
};

// delete category
export const removeCategory = (id) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        await axiosInstance.delete(`/category/${id}`);
        dispatch(deleteCategory(id));
    } catch (error) {
        dispatch(setError(error.response?.data?.message || "Failed to delete category"));
    } finally {
        dispatch(setLoading(false));
    }
};

export default categorySlice.reducer;
