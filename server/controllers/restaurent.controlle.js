import uploadOnCloudinary from "../config/cloudinary.js";
import Restaurant from "../models/restaurent.model.js";


export const createRestaurant = async (req, res) => {
    try {
        const { name, address, phone, categories } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Restaurant name is required" });
        }

        let imageUrl = "";
        if (req.file) {
            imageUrl = await uploadOnCloudinary(req.file.path);
        }

        const restaurant = new Restaurant({
            user: req.userId,
            name,
            address,
            phone,
            image: imageUrl,
            categories,
        });

        const created = await restaurant.save();
        res.status(201).json(created);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find()
            .populate("user", "name email")
            .populate("categories", "name");
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id)
            .populate("user", "name email")
            .populate("categories", "name");
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRestaurantByUserid = async (req, res) => {
    try {
        const restaurant = await Restaurant.find({ user: req.userId })
            .populate("user", "name email")
            .populate("categories", "name");
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateRestaurant = async (req, res) => {
    try {
        const { name, address, phone, categories } = req.body;
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        let imageUrl = restaurant.image;
        if (req.file) {
            imageUrl = await uploadOnCloudinary(req.file.path);
        }

        restaurant.name = name || restaurant.name;
        restaurant.address = address || restaurant.address;
        restaurant.phone = phone || restaurant.phone;
        restaurant.categories = categories || restaurant.categories;
        restaurant.image = imageUrl;

        const updated = await restaurant.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        await restaurant.deleteOne();
        res.json({ message: "Restaurant deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
