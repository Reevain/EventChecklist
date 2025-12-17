import User from '../models/User.models.js';
import ApiError from '../utils/ErrorHandeler.js';
import ApiResponse from '../utils/ResponseHandeler.js';
import asyncHandler from '../utils/asynkHandeler.js';

class AuthController {
  // Login method
  login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
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
    const accessToken = user.generateAccessToken();
    user.accessToken = accessToken;
    await user.save();

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000, // 1 hour
    };
    res.cookie('accessToken', accessToken, options);

    res.json(new ApiResponse(200, 'Login successful', { accessToken }));
  });


  // REGISTER method
  register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
      return next(new ApiError(400, 'Name, email and password are required'));
    }
    console.log(email   );
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(409, 'Email already in use'));
    }
    const newUser = new User({ email, password , name });
    await newUser.save();

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',

      maxAge: 3600000, // 1 hour
    };
    const accessToken = newUser.generateAccessToken();
    newUser.accessToken = accessToken;
    await newUser.save();
    res.cookie('accessToken', accessToken, options);
    res.status(201).json(new ApiResponse(201, 'User registered successfully'));
  });

  logout = asyncHandler(async (req, res, next) => {
    res.clearCookie('accessToken');
    res.json(new ApiResponse(200, 'Logout successful'));
  });

  // Verify authentication and return user info
  verify = asyncHandler(async (req, res, next) => {
    // This endpoint is protected by authenticateCookie middleware
    // If we reach here, the user is authenticated
    const user = req.user;
    const userData = await User.findById(user._id).select('-password -accessToken');
    res.json(new ApiResponse(200, 'User authenticated', {
      user: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
      }
    }));
  });
}

export default new AuthController();
