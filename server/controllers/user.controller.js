import bcrypt from 'bcryptjs'
import genToken from '../config/genToken.js'
import User from '../models/user.model.js'
import sendMail from '../config/Mail.js'
import uploadOnCloudinary from '../config/cloudinary.js'



export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All field required."
            })
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be atleast 6 characters."
            })
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already Exist.Please Login now."
            })
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        const hashedPassword = await bcrypt.hash(password, 10)

        const users = await User.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpire: Date.now() + 5 * 60 * 1000
        })

        const token = genToken(users._id)
        await sendMail(email, otp)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: true,
            samesite: "None"
        })

        return res.status(201).json({
            success: true,
            message: `Otp send on your ${users.email}`
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: `signup error ${error}` })
    }
}

// user login controller here
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All field required."
            })
        }
        // checkk user found or not
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password."
            })
        }

        if (!user.isVerify) {
            return res.status(400).json({
                success: false,
                message: "Please verify your account."
            })
        }
        // compaire password here
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password."
            })
        }

        // generate token here
        const token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: "None"
        })

        return res.status(200).json({
            success: true,
            message: "User login seccessfully.",
            user
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: `signup error ${error}` })
    }
}

// logout controller here
export const logout = async (req, res) => {
    try {
        res.clearCookie("token")

        return res.status(200).json({ success: true, message: "User logout successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: `signup error ${error}` })
    }
}

// verify account here controller 
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email })
        if (!user || user.otp !== otp || user.otpExpire < Date.now()) {
            return res.status(401).json({
                success: false,
                message: "invalid/expired otp"
            })
        }

        user.isVerify = true
        user.otp = undefined
        user.otpExpire = undefined

        await user.save()
        return res.status(201).json({
            success: true,
            message: "Otp verified successfully."
        })

    } catch (error) {
        return res.status(500).json({ message: `verify otp error ${error}` })
    }
}

// send otp here to reset password
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email not exist."
            })
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        user.otp = otp,
            user.otpExpire = Date.now() + 5 * 60 * 1000
        await user.save()
        await sendMail(email, otp)
        return res.status(201).json({
            success: true,
            message: "Sent otp successfully."
        })


    } catch (error) {
        return res.status(500).json({ message: `send otp error ${error}` })
    }
}

// verify account here controller 
export const verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email })
        if (!user || user.otp !== otp || user.otpExpire < Date.now()) {
            return res.status(401).json({
                success: false,
                message: "invalid/expired otp"
            })
        }

        user.isResetVerify = true
        user.otp = undefined
        user.otpExpire = undefined

        await user.save()
        return res.status(201).json({
            success: true,
            message: "Otp verified successfully."
        })

    } catch (error) {
        return res.status(500).json({ message: `verify otp error ${error}` })
    }
}

// reset password controller here
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "Passwords do not match."
            });
        }

        const user = await User.findOne({ email });
        if (!user || !user.isResetVerify) {
            return res.status(400).json({
                success: false,
                message: "Please verify your OTP first."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.isResetVerify = false;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });

    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// current user or user profile here
export const currentUaser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            })
        }
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        return res.status(500).json({ message: `Get current user error ${error}` })
    }
}

// edit profile here
export const editProfile = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }

        let image;
        if (req.file) {
            // Cloudinary upload
            const result = await uploadOnCloudinary(req.file.path);
            if (result) user.image = result;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;


        await user.save();

        return res.status(200).json({
            success: true,
            message: "User updated successfully.",
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Edit profile error: ${error.message || error}`
        });
    }
};

// change password here 
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Current password is incorrect" });

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// delete user here
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            })
        }

        await user.deleteOne();
        return res.status(200).json({
            success: true,
            message: "User deleted successfully."
        })
    } catch (error) {
        return res.status(500).json({ message: `delete  user error ${error}` })
    }
}



// get all users (only admin can access)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password -otp -otpExpire"); // exclude sensitive data
        return res.status(200).json({
            success: true,
            total: users.length,
            users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Get all users error: ${error.message || error}`
        });
    }
};


// change user role (admin only)
export const changeUserRole = async (req, res) => {
    try {
        const { id } = req.params; // user id
        const { type } = req.body; // new role

        if (!type) {
            return res.status(400).json({
                success: false,
                message: "Role is required."
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        user.type = type;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User role updated successfully.",
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Change user role error: ${error.message || error}`
        });
    }
};
