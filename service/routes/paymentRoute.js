import express from "express";
import { createPayment, deletePayment, getPayment } from "../controllers/paymentController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

export const paymentRouter = express.Router();


paymentRouter.post("/create",authMiddleware, isAdmin , createPayment);
paymentRouter.delete("/delete/:id",authMiddleware, isAdmin, deletePayment);
paymentRouter.get('/:id', getPayment);



