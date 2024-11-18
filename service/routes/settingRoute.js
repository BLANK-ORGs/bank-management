import express from "express";
import { getSetting, updateSetting } from "../controllers/settingController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

export const settingRoute = express.Router();


settingRoute.get("/", getSetting)
settingRoute.put("/",authMiddleware, isAdmin, updateSetting)