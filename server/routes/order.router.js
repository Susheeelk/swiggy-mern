// routes/order.route.js
import express from "express";
import isAuth from "../middlewere/auth.middlewere.js";
import { createOrder, deleteOrder, getAllOrders, getMyOrders, getVendorOrders, updateOrderStatus } from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.post("/", isAuth, createOrder);
orderRouter.get("/", isAuth, getMyOrders);
orderRouter.get("/all", isAuth, getAllOrders);
orderRouter.get("/vendor", isAuth, getVendorOrders);
orderRouter.put("/:id", isAuth, updateOrderStatus);
orderRouter.delete("/:id", isAuth, deleteOrder);

export default orderRouter;
