import express from 'express'
import isAuth from '../middlewere/auth.middlewere.js'
import { upload } from '../middlewere/multer.js'
import { createFood, deleteFood, getAllFood, getAllFoods, getFoodById, updateFood } from '../controllers/food.controller.js'

const foodRouter = express.Router()

foodRouter.post('/', isAuth, upload.single('image'), createFood)
foodRouter.get('/', getAllFoods)
foodRouter.get('/id', isAuth, getAllFood)
foodRouter.get('/:id', getFoodById)
foodRouter.put('/:id', isAuth, upload.single('image'), updateFood)
foodRouter.delete('/:id', isAuth, deleteFood)

export default foodRouter