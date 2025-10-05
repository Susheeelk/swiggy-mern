import { createSlice } from "@reduxjs/toolkit";
import axios from "../api/axios"

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        loading: false,
        error: null,
    },
    reducers: {
        placeOrderStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        placeOrderSuccess: (state, action) => {
            state.loading = false;
            state.orders.push(action.payload.order);
        },
        placeOrderFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
    },
});

export const { placeOrderStart, placeOrderSuccess, placeOrderFail, setOrders } = orderSlice.actions;
export default orderSlice.reducer;

// Async action
export const placeOrder = (orderData, navigate, toast) => async (dispatch) => {
    try {
        dispatch(placeOrderStart());
        const { data } = await axios.post("/orders", orderData, { withCredentials: true });

        dispatch(placeOrderSuccess(data));

        if (orderData.paymentMethod === "cod") {
            toast.success("Order placed successfully (COD)");
            navigate("/my-orders");
        } else {
            toast.info("Redirecting to payment...");
            navigate("/payment", { state: { clientSecret: data.clientSecret, orderId: data.order._id } });
        }

    } catch (error) {
        dispatch(placeOrderFail(error.response?.data?.message || "Order failed"));
        toast.error(error.response?.data?.message || "Order failed");
    }
};
