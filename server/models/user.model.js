import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['user', 'admin', 'vendor'],
        default: 'user'
    },
    otp: {
        type: String
    },
    otpExpire: {
        type: Date
    },
    isResetVerify: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)
export default User