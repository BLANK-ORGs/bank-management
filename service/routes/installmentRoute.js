import express from "express";
import { createInstallment, deleteInstallment, getInstallment, getReminderInstallment, updatedInstallment } from "../controllers/InstallmentController.js";
import Installment from "../models/InstallmentModel.js";


export const installmentRouter = express.Router();


installmentRouter.post('/create', createInstallment)

installmentRouter.get('/reminder', getReminderInstallment)
installmentRouter.get('/:id', getInstallment)

installmentRouter.put('/:id', updatedInstallment)

installmentRouter.delete("/:id", deleteInstallment);
