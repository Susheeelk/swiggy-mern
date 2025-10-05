import Stripe from "stripe";
import Food from "../models/food.model.js";
import Order from "../models/order.model.js";
import Restaurant from "../models/restaurent.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Create Order
export const createOrder = async (req, res) => {
    try {
        const { items, restaurant, address, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in order" });
        }

        // ✅ Calculate total
        let total = 0;
        const populatedItems = [];
        for (const item of items) {
            const food = await Food.findById(item.food);
            if (!food) return res.status(400).json({ message: "Invalid food item" });

            total += food.price * item.quantity;
            populatedItems.push({
                food: food._id,
                quantity: item.quantity,
                price: food.price,
                name: food.name,
            });
        }

        // ✅ COD case
        if (paymentMethod === "COD") {
            const order = new Order({
                user: req.userId,
                restaurant,
                items: populatedItems.map(i => ({ food: i.food, quantity: i.quantity })),
                address,
                totalAmount: total,
                status: "Pending", // will update when vendor accepts
                paymentMethod: "COD",
                paymentStatus: "Pending",
                paymentIntentId: null,
            });

            const saved = await order.save();
            return res.status(201).json({
                order: saved,
                redirectUrl: `${process.env.CLIENT_URL}/order-success`,
            });
        }

        // ✅ Online (Stripe Card)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: populatedItems.map(i => ({
                price_data: {
                    currency: "inr",
                    product_data: { name: i.name },
                    unit_amount: i.price * 100, // cents
                },
                quantity: i.quantity,
            })),
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/checkout`,
        });

        // Save order in DB with "Pending"
        const order = new Order({
            user: req.userId,
            restaurant,
            items: populatedItems.map(i => ({ food: i.food, quantity: i.quantity })),
            address,
            totalAmount: total,
            status: "Pending",
            paymentMethod: "Online",
            paymentStatus: "Pending",
            paymentIntentId: session.id,
        });

        const saved = await order.save();

        res.status(201).json({ redirectUrl: session.url, order: saved });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ success: false, message: "Session ID is required" });
        }

        // 🔍 Get session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            // 🟢 Update order in DB
            const order = await Order.findOne({ paymentIntentId: sessionId });

            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            order.paymentStatus = "Paid";
            order.status = "Paid";
            await order.save();

            return res.json({ success: true, message: "Payment verified & order updated" });
        }

        res.json({ success: false, message: "Payment not completed" });
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get Orders of Logged-in User
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId })
            .populate("restaurant", "name")
            .populate("items.food", "name price")
            .populate("address");

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        // Fetch all orders and populate references
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("restaurant", "name location")
            .populate("items.food", "name price")
            .populate("address");
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};
// ✅ Update Order Status (Admin/Vendor)
export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (req.body.status) order.status = req.body.status;
        if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;

        const updated = await order.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// jis restaurent se order hua h us vendor k0 order list show karega

export const getVendorOrders = async (req, res) => {
    try {
        // Get the vendor's restaurant
        const restaurant = await Restaurant.findOne({ user: req.userId });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found for this vendor"
            });
        }

        // Fetch all orders for this restaurant (multiple orders included)
        const orders = await Order.find({ restaurant: restaurant._id })
            .sort({ createdAt: -1 }) // optional: newest orders first
            .populate("user", "name email")
            .populate("restaurant", "name location")
            .populate("items.food", "name price")
            .populate("address");

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};



// ✅ Delete Order (Admin / Vendor)
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // ✅ Vendor: ensure order belongs to their restaurant
        if (req.userRole === "vendor") {
            const restaurant = await Restaurant.findOne({ user: req.userId });
            if (!restaurant || order.restaurant.toString() !== restaurant._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "Not authorized to delete this order"
                });
            }
        }

        // ✅ Delete the order
        await order.deleteOne();

        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        console.error("Delete order error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete order",
            error: error.message
        });
    }
};
