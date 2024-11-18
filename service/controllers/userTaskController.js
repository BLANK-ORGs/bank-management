import asyncHandler from "express-async-handler";
import UserTask from "../models/userTaskModel.js";
import User from "../models/userModel.js";

export const createTask = asyncHandler(async (req, res) => {
  const {
    userId,
    installmentId,
    customerCode,
    description,
    address,
    areaId,
    amount,
    date,
  } = req.body;
  try {
    if (installmentId) {
      const task = await UserTask.findOne({
        installmentId,
      });

      if (task) {
        const updatedTask = await UserTask.findByIdAndUpdate(task._id, {
          date: date || undefined,
          amount: amount || undefined,
        });
        return res
          .status(201)
          .json({
            success: true,
            message: "Task updated successfully",
            updatedTask,
          });
      }
    }

    const userTask = await UserTask.create({
      userId: userId || undefined,
      installmentId: installmentId || undefined,
      customerCode: customerCode || undefined,
      address: address || undefined,
      areaId: areaId || undefined,
      amount: amount || undefined,
      date: date || undefined,
      description: description || undefined,
    });
    if (!userTask) {
      return res
        .status(400)
        .json({ success: false, message: "Task not created" });
    }
    return res
      .status(201)
      .json({ success: true, message: "Task created successfully", userTask });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export const updateTask = asyncHandler(async (req, res) => {
  const { userId, customerCode, address, description, areaId, amount, date } =
    req.body;
  try {
    const userTask = await UserTask.findByIdAndUpdate(req.params.id, {
      userId: userId || undefined,
      customerCode: customerCode || undefined,
      address: address || undefined,
      areaId: areaId || undefined,
      amount: amount || undefined,
      date: date || undefined,
      description: description || undefined,
    });
    if (!userTask) {
      return res
        .status(400)
        .json({ success: false, message: "Task not updated" });
    }
    return res
      .status(201)
      .json({ success: true, message: "Task updated successfully", userTask });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export const deleteTask = asyncHandler(async (req, res) => {
  try {
    const userTask = await UserTask.findById(req.params.id);
    if (userTask) {
      userTask.isDeleted = true;
      await userTask.save();
      return res
        .status(200)
        .json({ success: true, message: "Task removed successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export const submitTask = asyncHandler(async (req, res) => {
  const { statusDescription } = req.body;
  try {
    const userTask = await UserTask.findByIdAndUpdate(req.params.id, {
      status: "completed",
      statusDescription: statusDescription || undefined,
    });
    if (!userTask) {
      return res
        .status(400)
        .json({ success: false, message: "Task not submitted" });
    }
    return res.status(201).json({
      success: true,
      message: "Task submitted successfully",
      userTask,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export const getAllUserTask = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;

  try {
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    const query = search ? { userId: search } : {};
    query.isDeleted = false;

    const userTask = await UserTask.find(query)
      .sort({ createdAt: -1 })
      .populate({ path: "userId", select: "-password" })
      .populate({
        path: "customerCode",
        populate: { path: "areaCode", select: "name" },
      })
      .limit(pageSize)
      .skip(skip);
    const totalPages = await UserTask.countDocuments(query);

    if (userTask) {
      return res.status(200).json({
        success: true,
        message: "Task fetched successfully",
        userTask,
        totalPages: Math.ceil(totalPages / pageSize),
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
