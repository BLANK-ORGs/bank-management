import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers?.authorization?.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        if (!user) {
          res.status(401).json({
            success: false,
            message: "Not Authorized, Please Login Again",
          });
        }
        req.user = user;
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({
        success: false,
        message: "Not Authorized, Please Login Again",
      });
    }
  } else {
    res
      .status(401)
      .json({ success: false, message: "Not Authorized, Please Login Again" });
    // throw new Error("There is no token attached to the header...");
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (!adminUser.isAdmin) {
    return res.status(401).json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  } else {
    next();
  }
});
