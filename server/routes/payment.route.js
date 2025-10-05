import express from "express";
import { verifyPayment } from "../controllers/order.controller.js";

const router = express.Router();

// ✅ POST /api/payments/verify
router.post("/verify", verifyPayment);

export default router;
