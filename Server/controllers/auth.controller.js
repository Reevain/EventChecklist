import User from '../models/User.models.js';
import ApiError from '../utils/ErrorHandeler.js';
import ApiResponse from '../utils/ResponseHandeler.js';
import asyncHandler from '../utils/asynkHandeler.js';

class AuthController {

  // LOGIN
  login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Email and password are required'));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return next(new ApiError(401, 'Invalid password'));
    }

    const token = user.generateAccessToken();

    res.status(200).json(
      new ApiResponse(200, 'Login successful', {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      })
    );
  });


  // REGISTER
  register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ApiError(400, 'Name, email and password are required'));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(409, 'Email already in use'));
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = newUser.generateAccessToken();

    res.status(201).json(
      new ApiResponse(201, 'User registered successfully', {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email
        }
      })
    );
  });


  // LOGOUT
  logout = asyncHandler(async (req, res, next) => {
    // No cookies to clear anymore
    res.json(new ApiResponse(200, 'Logout successful'));
  });


  // VERIFY (Protected Route)
  verify = asyncHandler(async (req, res, next) => {
    const user = req.user;

    res.json(
      new ApiResponse(200, 'User authenticated', {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      })
    );
  });
}

export default new AuthController();