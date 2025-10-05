import express from "express";
import isAuth from "../middlewere/auth.middlewere.js";
import { getVendorStats, getVendorOrders } from "../controllers/vendor.controller.js";

const vendorRouter = express.Router();

// ✅ Vendor stats
vendorRouter.get("/stats", isAuth, getVendorStats);

// ✅ Vendor recent orders
vendorRouter.get("/orders", isAuth, getVendorOrders);

export default vendorRouter;
