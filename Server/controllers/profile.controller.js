import Profile from "../models/Profile.models.js";
import asyncHandler from "../utils/asynkHandeler.js";
import ApiError from "../utils/ErrorHandeler.js";
import ApiResponse from "../utils/ResponseHandeler.js";
// import {uploadToCloudinary} from "../utils/cloudinary.js";
class ProfileController {

    // Create or update user profile
    createOrUpdateProfile = asyncHandler(async (req, res, next) => {
        const userId = req.user.id;
        const { bio, college, socialLinks , name , contactEmail } = req.body;
        let profile = await Profile.findOne({ user: userId });


        if (profile) {
            // Update existing profile
            profile.bio = bio || profile.bio;
            profile.avatarUrl = avatarUrl || profile.avatarUrl;
            profile.college = college || profile.college;
            profile.socialLinks = socialLinks || profile.socialLinks;
            profile.updatedAt = Date.now();
            profile.contactEmail = contactEmail || profile.contactEmail;
            await profile.save();
            return res.json(new ApiResponse(200, 'Profile updated successfully', profile));
        } else {
            // Create new profile
            profile = new Profile({
                user: userId,
                bio,
                avatarUrl,
                college,
                socialLinks
                , contactEmail
            });
            await profile.save();
            return res.json(new ApiResponse(201, 'Profile created successfully', profile));
        }
    });

    // upload avatar  multer middleware required
    uploadAvatar = asyncHandler(async (req, res, next) => {
        const userId = req.user.id;
        if (!req.file) {
            return next(new ApiError(400, 'No file uploaded'));
        }
        const avatarUrl = await uploadToCloudinary(req.file.path, 'avatars');
            console.log('Avatar URL:', avatarUrl);
        let profile = await Profile.findOne({ user: userId });
        if (!profile) {
            return next(new ApiError(404, 'Profile not found'));
        }
        profile.avatarUrl = avatarUrl;
        profile.updatedAt = Date.now();
        await profile.save();
        res.json(new ApiResponse(200, 'Avatar uploaded successfully', { avatarUrl }));
    });

     test = asyncHandler(async (req, res, next) => {
        const data = req.user;
        res.json(new ApiResponse(200, 'Profile controller is working fine', { data }));
        
    });
}
export default new ProfileController();