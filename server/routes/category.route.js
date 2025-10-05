import express from "express";
import isAuth from "../middlewere/auth.middlewere.js";
import { upload } from "../middlewere/multer.js";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/category.controller.js";

const catRoute = express.Router();

catRoute.post('/', isAuth, upload.single('image'), createCategory)
catRoute.get("/", getAllCategories);
catRoute.get("/:id", getCategoryById);
catRoute.put('/:id', isAuth, upload.single('image'), updateCategory)
catRoute.delete("/:id", isAuth, deleteCategory);


export default catRoute;