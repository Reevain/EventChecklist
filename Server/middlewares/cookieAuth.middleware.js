import jwt from 'jsonwebtoken';
import User from '../models/User.models.js';
import ApiError from '../utils/ErrorHandeler.js';
import asyncHandler from '../utils/asynkHandeler.js';

// Middleware to authenticate user from cookie
export const authenticateCookie = asyncHandler(async (req, res, next) => {
  // Get token from cookie
  const token = req.cookies?.accessToken;

  if (!token) {
    return next(new ApiError(401, 'No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded);
    const user = await User.findById(
      decoded.id,
      '_id username email '
    );

    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
});
