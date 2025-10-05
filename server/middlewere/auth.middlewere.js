import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ success: false, message: "token not found" })
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY)

        if (!decode) {
            return res.status(400).json({ success: false, message: "Unauthorize." })
        }
        req.userId = decode.userId

        next()
    } catch (error) {
        return res.status(500).json({ success: false, message: `is auth error ${error}` })
    }
}



// admin protected here
export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.type !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: `isAdmin error ${error}` });
    }
};

// vendor here
export const isVendor = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.type !== "vendor") {
            return res.status(403).json({ message: "Access denied. Vendor only." });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: `isVendor error ${error}` });
    }
};


// dono user ho tab wo middlewere 
export const isAdminOrVendor = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);

        if (!user || (user.type !== 'admin' && user.type !== 'vendor')) {
            return res.status(403).json({ message: "Access denied. Only admin or vendor allowed." });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: `isAdminOrVendor error: ${error}` });
    }
};


export default isAuth