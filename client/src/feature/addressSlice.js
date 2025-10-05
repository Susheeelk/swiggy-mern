import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
    name: "address",
    initialState: {
        addresses: [],
    },
    reducers: {
        setAddresses: (state, action) => {
            state.addresses = action.payload;
        },
        addAddress: (state, action) => {
            state.addresses.push(action.payload);
        },
        updateAddress: (state, action) => {
            const index = state.addresses.findIndex(a => a._id === action.payload._id);
            if (index !== -1) state.addresses[index] = action.payload;
        },
        deleteAddress: (state, action) => {
            state.addresses = state.addresses.filter(a => a._id !== action.payload);
        },
    },
});

export const { setAddresses, addAddress, updateAddress, deleteAddress } = addressSlice.actions;
export default addressSlice.reducer;
