import Food from "../models/food.model.js";
import Order from "../models/order.model.js";
import Restaurant from "../models/restaurent.model.js";



// 🟢 Get Vendor Stats
export const getVendorStats = async (req, res) => {
    try {
        const vendorId = req.userId; // isAuth middleware से vendor id

        // 1️⃣ Total Foods
        const foodsCount = await Food.countDocuments({ user: vendorId });

        // 2️⃣ Total Restaurants
        const restaurantsCount = await Restaurant.countDocuments({ user: vendorId });

        // 3️⃣ Vendor Orders
        const orders = await Order.find({
            restaurant: { $in: await Restaurant.find({ user: vendorId }).distinct("_id") }
        });

        const ordersCount = orders.length;

        // 4️⃣ Revenue from Delivered orders
        const revenue = orders
            .filter((o) => o.status === "Delivered")
            .reduce((sum, o) => sum + o.totalAmount, 0);

        res.json({
            foods: foodsCount,
            restaurants: restaurantsCount,
            orders: ordersCount,
            revenue
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch vendor stats" });
    }
};

// 🟢 Get Vendor Recent Orders
export const getVendorOrders = async (req, res) => {
    try {
        const vendorId = req.userId;
        const limit = parseInt(req.query.limit) || 5;

        // vendor ke restaurants
        const restaurantIds = await Restaurant.find({ user: vendorId }).distinct("_id");

        const orders = await Order.find({ restaurant: { $in: restaurantIds } })
            .populate("user", "name")
            .populate("restaurant", "name")
            .sort({ createdAt: -1 })
            .limit(limit);

        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch vendor orders" });
    }
};
