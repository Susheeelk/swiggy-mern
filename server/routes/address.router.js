import express from "express";
import isAuth from "../middlewere/auth.middlewere.js";
import { createAddress, deleteAddress, getAddresses, updateAddress } from "../controllers/address.controller.js";


const addressRouter = express.Router();

addressRouter.post("/", isAuth, createAddress);
addressRouter.get("/", isAuth, getAddresses);
addressRouter.put("/:id", isAuth, updateAddress);
addressRouter.delete("/:id", isAuth, deleteAddress);

export default addressRouter;
