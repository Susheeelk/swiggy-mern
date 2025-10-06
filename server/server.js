import express from 'express'
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import connectDb from './config/db.js'
import userRouter from './routes/user.route.js'
import catRoute from './routes/category.route.js'
import foodRouter from './routes/food.route.js'
import resRouter from './routes/reataurant.route.js'
import orderRouter from './routes/order.router.js'
import addressRouter from './routes/address.router.js'
dotenv.config()
const app = express()

const port = process.env.PORT || 5000

app.use(cors({
    origin: "*",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// define routr here
app.use('/api/auth', userRouter)
app.use('/api/category', catRoute)
app.use('/api/restaurant', resRouter)
app.use('/api/foods', foodRouter)
app.use('/api/orders', orderRouter);
app.use('/api/address', addressRouter)
import paymentRoutes from "./routes/payment.route.js";
import vendorRouter from './routes/vendor.route.js'
app.use("/api/payments", paymentRoutes);
app.use("/api/vendor", vendorRouter);



app.listen(port, () => {
    connectDb()
    console.log("server started", port)
})
