import jwt from "jsonwebtoken";
import User from "../models/User.models.js";
import ApiError from "../utils/ErrorHandeler.js";
import asyncHandler from "../utils/asynkHandeler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "No token provided"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid token"));
  }
});