import Area from "../models/areaModel.js";
import asyncHandler from "express-async-handler";

// Create a new Area
export const createArea = asyncHandler(async (req, res) => {
  const { name, date, employeeId } = req.body;

  try {
    const areaExists = await Area.findOne({ name });

    if (areaExists) {
      return res
        .status(400)
        .json({ success: false, message: "Area already exists" });
    }

    const area = await Area.create({
      name,
      date,
      employeeId: employeeId || null,
    });

    if (area) {
      res.status(201).json({
        success: true,
        message: "Area created successfully",
        area: {
          _id: area._id,
          name: area.name,
          date: area.date,
          employeeId: area.employeeId,
        },
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid area data" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all Areas
export const getAllAreas = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;
  try {
    const totalAreas = await Area.countDocuments();
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    const areas = await Area.find({})
      .populate("employeeId")
      .limit(pageSize)
      .skip(skip)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 });
    res
      .status(200)
      .json({
        success: true,
        areas,
        totalPages: Math.ceil(totalAreas / pageSize),
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export const getAAreas = asyncHandler(async (req, res) => {
  try {
    const area = await Area.findById(req.params.id).populate("employeeId");
    if (area) {
      res.status(200).json({ success: true, area });
    } else {
      res.status(404).json({ success: false, message: "Area not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
})

// Update an Area by ID
export const updateArea = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, date, employeeId } = req.body;
  

  try {
    const updatedArea = await Area.findByIdAndUpdate(
      id,
      { $set: {
        name,
        date,
        employeeId: employeeId || null,
      } },
      { new: true }
    );

    if (updatedArea) {
      res
        .status(200)
        .json({
          success: true,
          message: "Area updated successfully",
          area: updatedArea,
        });
    } else {
      res.status(404).json({ success: false, message: "Area not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete an Area by ID
export const deleteArea = asyncHandler(async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);

    if (area) {
      await area.remove();
      res
        .status(200)
        .json({ success: true, message: "Area removed successfully" });
    } else {
      res.status(404).json({ success: false, message: "Area not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
