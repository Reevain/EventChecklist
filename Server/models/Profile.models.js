import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  college: { type: String, default: '' },
  socialLinks: {
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
  contactEmail: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // likes 
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },

  //views 
  views: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  viewsCount: { type: Number, default: 0 },

},{timestamps:true});

const Profile = mongoose.model('Profile', ProfileSchema);

export default Profile;
