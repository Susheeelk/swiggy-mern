import mongoose from "mongoose";

const restaurentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },

    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        }
    ],
}, {
    timestamps: true
})

const Restaurant = mongoose.model("Restaurant", restaurentSchema)

export default Restaurant