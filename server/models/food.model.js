import mongoose from "mongoose";


const foodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, "Food name is required"],
    },
    description: {
        type: String,
        default: "",
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    image: {
        type: String,
        default: "",
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema);

export default Food