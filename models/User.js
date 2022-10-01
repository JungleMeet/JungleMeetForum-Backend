const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
  createTime: {
    type: Date,
  },
  bgImg: {
    type: String,
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
});

module.exports = mongoose.model('User', UserSchema);
