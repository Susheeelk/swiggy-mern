import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
        items: [
            {
                food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
                quantity: { type: Number, required: true, default: 1 }
            }
        ],
        address: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
        totalAmount: { type: Number, required: true },

        status: {
            type: String,
            enum: ["Pending", "Paid", "Preparing", "Delivered", "Cancelled"],
            default: "Pending"
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "Online"],
            required: true
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending"
        },

        paymentIntentId: { type: String },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
