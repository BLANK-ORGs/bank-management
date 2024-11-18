import express from "express";
import {
  createArea,
  getAllAreas,
  updateArea,
  deleteArea,
  getAAreas,
} from "../controllers/areaController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

export const areaRouter = express.Router();

// Route to create a new area
areaRouter.post("/create",authMiddleware, isAdmin, createArea);

// Route to get all areas
areaRouter.get("/all", getAllAreas);
areaRouter.get('/:id', getAAreas);

// Route to update an area by ID
areaRouter.put("/update/:id",authMiddleware, isAdmin, updateArea);

// Route to delete an area by ID
areaRouter.delete("/delete/:id",authMiddleware, isAdmin, deleteArea);
