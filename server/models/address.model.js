import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        house: {
            type: String,
            required: true,
        },
        area: {
            type: String,
            required: true,
        },
        landmark: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        default: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
export default Address