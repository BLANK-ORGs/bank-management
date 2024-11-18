import express from "express";
import {
  createLoan,
  getAllLoans,
  updateLoan,
  deleteLoan,
  actionLoan,
  getALoan,
  getReminderLoan,
} from "../controllers/loanController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const LoanRouter = express.Router();


LoanRouter.post("/create",authMiddleware, createLoan);


LoanRouter.get("/all", getAllLoans);
LoanRouter.get("/reminder", getReminderLoan);

LoanRouter.put("/update/:id",authMiddleware, updateLoan);
LoanRouter.put("/action/:id",authMiddleware, actionLoan);


LoanRouter.delete("/delete/:id",authMiddleware, deleteLoan);
LoanRouter.get("/:id", getALoan);

