import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Profile from './Profile.models.js';

dotenv.config();

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    accessToken: { type: String },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password with hashed one
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT access token
UserSchema.methods.generateAccessToken = function () {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing in environment variables");
  }

  return jwt.sign(
    { id: this._id, email: this.email },   // FIX: removed userName
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Verify JWT token
UserSchema.methods.verifyToken = function (token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Auto-create profile after new user is saved
UserSchema.post("save", async function (doc, next) {
  try {
    // check if profile already exists
    const exists = await Profile.findOne({ user: doc._id });
    if (!exists) {
      await Profile.create({
        user: doc._id,
        bio: "",
        avatarUrl: "",
        college: "",
        socialLinks: {
          twitter: "",
          facebook: "",
          linkedin: "",
          instagram: "",
        },
        contactEmail: "",
        likes: [],
        likesCount: 0,
        views: [],
        viewsCount: 0,
      });
    }
    next();
  } catch (err) {
    console.error("PROFILE CREATION ERROR:", err);
    next(err);
  }
});

const User = mongoose.model('User', UserSchema);
export default User;
