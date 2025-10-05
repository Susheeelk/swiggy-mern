import express from "express";
import isAuth from "../middlewere/auth.middlewere.js";
import { upload } from "../middlewere/multer.js";
import { createRestaurant, deleteRestaurant, getAllRestaurants, getRestaurantById, getRestaurantByUserid, updateRestaurant } from "../controllers/restaurent.controlle.js";


const resRouter = express.Router();

resRouter.post('/', isAuth, upload.single('image'), createRestaurant)
resRouter.get('/', getAllRestaurants)
resRouter.get('/id', isAuth, getRestaurantByUserid)
resRouter.get('/:id', getRestaurantById)
resRouter.put('/:id', isAuth, upload.single('image'), updateRestaurant)
resRouter.delete('/:id', isAuth, deleteRestaurant)


export default resRouter;