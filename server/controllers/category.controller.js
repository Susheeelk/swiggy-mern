import uploadOnCloudinary from "../config/cloudinary.js";
import Category from "../models/category.model.js";

// Create category
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Category name is required" });
        }

        let imageUrl = "";
        if (req.file) {
            imageUrl = await uploadOnCloudinary(req.file.path);
        }

        const category = new Category({
            user: req.userId,
            name,
            image: imageUrl,
        });

        const created = await category.save();

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category: created,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.json({ success: true, categories });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get category by id
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        return res.json({ success: true, category });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Update category
export const updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        let imageUrl = category.image;
        if (req.file) {
            imageUrl = await uploadOnCloudinary(req.file.path);
        }

        category.name = name || category.name;
        category.image = imageUrl;

        const updated = await category.save();

        return res.json({
            success: true,
            message: "Category updated successfully",
            category: updated,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Delete category
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        await category.deleteOne();
        return res.json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
