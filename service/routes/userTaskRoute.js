import express from "express"
import { createTask, deleteTask, getAllUserTask, submitTask, updateTask } from "../controllers/userTaskController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";


export const userTaskRouter = express.Router();



userTaskRouter.post("/create",authMiddleware, isAdmin, createTask);


userTaskRouter.delete("/delete/:id", authMiddleware, isAdmin, deleteTask );


userTaskRouter.put("/update/:id",authMiddleware, isAdmin, updateTask );
userTaskRouter.put("/submit/:id",authMiddleware, submitTask );


userTaskRouter.get("/all",authMiddleware, getAllUserTask);
