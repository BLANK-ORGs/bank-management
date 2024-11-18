import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken } from "../config/jwtToken.js";
import { validateMongoDbId } from "../config/validateMongoDbId.js";
import bcrypt from "bcrypt";

// Register User
export const registerUser = asyncHandler(async (req, res) => {
  const {
    isAdmin,
    location,
    profilePicture,
    firstName,
    surName,
    email,
    password,
    nic,
    gender,
    dateOfBirth,
    mobileNumber,
    address,
    civilStatus,
  } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    let hashPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    }

    const newUser = await User.create({
      firstName: firstName || undefined,
      surName: surName || undefined,
      email: email || undefined,
      password: hashPassword || undefined,
      mobileNumber: mobileNumber || undefined,
      isAdmin: isAdmin || undefined,
      nic: nic || undefined,
      gender: gender || undefined,
      dateOfBirth: dateOfBirth || undefined,
      civilStatus: civilStatus || undefined,
      address: address || undefined,
      location: location || undefined,
      profilePicture: profilePicture || undefined,
    });

    const { password: pass, ...others } = newUser._doc;

    if (newUser) {
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        user: others,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...rest } = user._doc;
      return res.json({
        success: true,
        message: "Login successful",
        userInfo: rest,
        token: generateToken(user._id),
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Update User
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    isAdmin,
    location,
    profilePicture,
    firstName,
    surName,
    email,
    password,
    nic,
    gender,
    dateOfBirth,
    mobileNumber,
    address,
    civilStatus,
  } = req.body;

  try {
    let hashPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findById(id);

    updatedUser.firstName = firstName || updatedUser.firstName;
    updatedUser.surName = surName || updatedUser.surName;
    updatedUser.email = email || updatedUser.email;
    updatedUser.mobileNumber = mobileNumber || updatedUser.mobileNumber;
    updatedUser.isAdmin = isAdmin !== undefined ? isAdmin : updatedUser.isAdmin;
    updatedUser.nic = nic || updatedUser.nic;
    updatedUser.gender = gender || updatedUser.gender;
    updatedUser.dateOfBirth = dateOfBirth || updatedUser.dateOfBirth;
    updatedUser.civilStatus = civilStatus || updatedUser.civilStatus;
    (updatedUser.address = address || updatedUser.address),
      (updatedUser.password = hashPassword || updatedUser.password);
    updatedUser.location = location || updatedUser.location;
    updatedUser.profilePicture = profilePicture || updatedUser.profilePicture;
    await updatedUser.save();

    if (updatedUser) {
      const { password, ...others } = updatedUser._doc;
      return res.json({
        success: true,
        message: "User updated successfully",
        user: others,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get a User
export const getAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    validateMongoDbId(id);

    const user = await User.findById(id);
    if (user) {
      return res.json({ success: true, user });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get All Users
export const getAllUser = asyncHandler(async (req, res) => {
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
    const totalUsers = await User.countDocuments();
    const users = await User.find().limit(pageSize).skip(skip);
    return res.json({
      success: true,
      users,
      totalPages: Math.ceil(totalUsers / pageSize),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
