import uploadOnCloudinary from "../config/cloudinary.js";
import Food from "../models/food.model.js";


export const createFood = async (req, res) => {
    try {
        const { name, description, price, category, restaurant, isAvailable } = req.body;
        if (!name || !price || !category || !restaurant) {
            return res.status(400).json({ message: "Name, price, category, and restaurant are required" });
        }

        let imageUrl = "";
        if (req.file) {
            imageUrl = await uploadOnCloudinary(req.file.path);
        }

        const food = new Food({
            user: req.userId,
            name,
            description,
            price,
            image: imageUrl,
            category,
            restaurant,
            isAvailable,
        });

        const created = await food.save();
        res.status(201).json(created);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllFoods = async (req, res) => {
    try {
        const foods = await Food.find()
            .populate("category", "name")
            .populate("restaurant", "name")
            .populate("user", "name email");
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get food by userid
export const getAllFood = async (req, res) => {
    try {
        const foods = await Food.find({ user: req.userId })
            .populate("category", "name")
            .populate("restaurant", "name")
            .populate("user", "name email");
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFoodById = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id)
            .populate("category", "name")
            .populate("restaurant", "name")
            .populate("user", "name email");
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }
        res.json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateFood = async (req, res) => {
    try {
        const { name, description, price, category, restaurant, isAvailable } = req.body;
        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        let imageUrl = food.image;
        if (req.file) {
            imageUrl = await uploadOnCloudinary(req.file.path);
        }

        food.name = name || food.name;
        food.description = description || food.description;
        food.price = price || food.price;
        food.category = category || food.category;
        food.restaurant = restaurant || food.restaurant;
        food.isAvailable = isAvailable !== undefined ? isAvailable : food.isAvailable;
        food.image = imageUrl;

        const updated = await food.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }
        await food.deleteOne();
        res.json({ message: "Food deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
