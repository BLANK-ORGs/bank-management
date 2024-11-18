import Guarantor from "../models/guarantorModel.js";
import asyncHandler from "express-async-handler";

// Create a Guarantor
export const createGuarantor = asyncHandler(async (req, res) => {
  const {
    nic,
    location,
    firstName,
    surName,
    address,
    number,
    gender,
    dateOfBirth,
    civilStatus,
    profilePicture,
    guarantorCode,
  } = req.body;

  try {
    const guarantorExists = await Guarantor.findOne({ nic });
    if (guarantorExists) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Guarantor already exists with this NIC",
        });
    }

    const guarantor = await Guarantor.create({
      nic: nic || undefined,
      location: location || undefined,
      firstName: firstName || undefined,
      surName: surName || undefined,
      address: address || undefined,
      number: number || undefined,
      gender: gender || undefined,
      dateOfBirth: dateOfBirth || undefined,
      civilStatus: civilStatus || undefined,
      profilePicture: profilePicture || undefined,
      guarantorCode: guarantorCode || undefined,
    });

    return res
      .status(201)
      .json({
        success: true,
        message: "Guarantor created successfully",
        guarantor,
      });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.guarantorCode) {
      res
        .status(400)
        .json({ success: false, message: "Guarantor code already exists" });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

// Get all Guarantors
export const getAllGuarantors = asyncHandler(async (req, res) => {
  const {
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 20,
  } = req.query;

  const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  const pageNumber = Number(page);
  const pageSize = Number(limit);
  const skip = (pageNumber - 1) * pageSize;

  try {
    const totalGuarantor = await Guarantor.countDocuments();
    const guarantors = await Guarantor.find()
      .limit(pageSize)
      .skip(skip)
      .sort(sortOptions);
    return res.json({
      success: true,
      guarantors,
      totalPages: Math.ceil(totalGuarantor / pageSize),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Update a Guarantor
export const updateGuarantor = asyncHandler(async (req, res) => {
  const {
    nic,
    location,
    firstName,
    surName,
    address,
    number,
    gender,
    dateOfBirth,
    civilStatus,
    profilePicture,
    guarantorCode,
  } = req.body;

  try {
    const guarantor = await Guarantor.findById(req.params.id);

    if (guarantor) {
      guarantor.nic = nic || guarantor.nic || undefined;
      guarantor.location = location || guarantor.location || undefined;
      guarantor.firstName = firstName || guarantor.firstName || undefined;
      guarantor.surName = surName || guarantor.surName || undefined;
      guarantor.address = address || guarantor.address || undefined;
      guarantor.number = number || guarantor.number || undefined;
      guarantor.gender = gender || guarantor.gender || undefined;
      guarantor.dateOfBirth = dateOfBirth || guarantor.dateOfBirth || undefined;
      guarantor.civilStatus = civilStatus || guarantor.civilStatus || undefined;
      guarantor.profilePicture =
        profilePicture || guarantor.profilePicture || undefined;
      guarantor.guarantorCode =
        guarantorCode || guarantor.guarantorCode || undefined;

      const updatedGuarantor = await guarantor.save();
      return res
        .status(200)
        .json({
          success: true,
          message: "Guarantor updated successfully",
          guarantor: updatedGuarantor,
        });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Guarantor not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a Guarantor
export const deleteGuarantor = asyncHandler(async (req, res) => {
  try {
    const guarantor = await Guarantor.findById(req.params.id);

    if (guarantor) {
      await guarantor.remove();
      return res
        .status(200)
        .json({ success: true, message: "Guarantor removed successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Guarantor not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export const searchGuarantor = asyncHandler(async (req, res) => {
  const { guarantorCode } = req.query;

  try {
    const guarantors = await Guarantor.find({
      $or: [
        { guarantorCode },
        { nic: guarantorCode },
        { firstName: guarantorCode }
      ]
    });

    if (!guarantors || guarantors.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No Guarantors found" });
    }

    res.status(200).json({ success: true, guarantors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
