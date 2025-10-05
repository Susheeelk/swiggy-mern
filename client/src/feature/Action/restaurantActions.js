import axiosInstance from "../../api/axios";
import { setRestaurants, setRestaurant, addRestaurant, updateRestaurant, deleteRestaurant } from "../restaurantSlice";
import { toast } from "react-toastify";

// ✅ Fetch all restaurants
export const fetchRestaurants = () => async (dispatch) => {
    try {
        const { data } = await axiosInstance.get("/restaurant");
        dispatch(setRestaurants(data));
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch restaurants");
    }
};

// get restaurent by id
export const fetchRestaurant = () => async (dispatch) => {
    try {
        const { data } = await axiosInstance.get("/restaurant/id");
        dispatch(setRestaurant(data));
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch restaurants");
    }
};

// ✅ Add restaurant (with image upload)
export const createRestaurant = (restaurantData) => async (dispatch) => {
    try {
        const formData = new FormData();
        for (const key in restaurantData) {
            formData.append(key, restaurantData[key]);
        }

        const { data } = await axiosInstance.post("/restaurant", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        dispatch(addRestaurant(data));
        toast.success("Restaurant added successfully");
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to add restaurant");
    }
};

// ✅ Update restaurant
export const editRestaurant = (id, restaurantData) => async (dispatch) => {
    try {
        const formData = new FormData();
        for (const key in restaurantData) {
            formData.append(key, restaurantData[key]);
        }

        const { data } = await axiosInstance.put(`/restaurant/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        dispatch(updateRestaurant(data));
        toast.success("Restaurant updated successfully");
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update restaurant");
    }
};

// ✅ Delete restaurant
export const removeRestaurant = (id) => async (dispatch) => {
    try {
        await axiosInstance.delete(`/restaurant/${id}`);
        dispatch(deleteRestaurant(id));
        toast.success("Restaurant deleted successfully");
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete restaurant");
    }
};
