import express from "express";
import {
  getAllUser,
  getAUser,
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/userController.js";

import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

export const userRouter = express.Router();

// all post routes
userRouter.post("/register", authMiddleware, isAdmin, registerUser);
userRouter.post("/login", loginUser);

// all get routes
userRouter.get("/all-users", authMiddleware, getAllUser);
userRouter.get("/:id", getAUser);

// all put routes
userRouter.put("/update/:id", authMiddleware, isAdmin, updateUser);

// all delete routes
