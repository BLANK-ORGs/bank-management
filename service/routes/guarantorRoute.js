import express from "express";
import {
  createGuarantor,
  getAllGuarantors,
  updateGuarantor,
  deleteGuarantor,
  searchGuarantor,
} from "../controllers/guarantorController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const guarantorRouter = express.Router();

// Route to create a new guarantor
guarantorRouter.post("/create",authMiddleware, createGuarantor);

// Route to get all guarantors
guarantorRouter.get("/all", getAllGuarantors);

// Route to update a guarantor by ID
guarantorRouter.put("/update/:id",authMiddleware, updateGuarantor);

guarantorRouter.get('/search', searchGuarantor);

// Route to delete a guarantor by ID
guarantorRouter.delete("/delete/:id",authMiddleware, deleteGuarantor);
