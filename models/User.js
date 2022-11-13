const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      minlength: 3,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: [6, 'Password must be at least 6 characters'],
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      match: [/^.+@(?:[\w-]+\.)+\w+$/, 'Please fill a valid email address'],
      unique: true,
    },
    avatar: {
      type: String,
    },
    bgImg: {
      type: String,
      default: 'https://imagefromapi.s3.ap-southeast-2.amazonaws.com/profile_background.jpg',
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user',
    },
    follower: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    followingPost: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(this.password, salt);
    this.password = hashedPwd;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', UserSchema);
