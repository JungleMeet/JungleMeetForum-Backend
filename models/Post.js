const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: [true, 'Title is empty'],
    },
    content: {
      type: String,
      // required: [true, 'Content is empty'],
    },
    hashtag: {
      type: String,
    },
    bgImg: {
      type: String,
      default: 'https://imagefromapi.s3.ap-southeast-2.amazonaws.com/bgPost.jpg'
      // required: [true, 'Please provide background image'],
    },
    visible: {
      type: Boolean,
      default: true,
    },
    resourceId: { type: String },
    viewNumber: { type: Number, default: 0 },
    postType: {
      type: String,
      required: true,
      enum: ['userPost', 'moviePost'],
      default: 'userPost',
    },
    author: {
      type: mongoose.Types.ObjectId,
      // required: [true, 'Author is empty'],
      ref: 'User',
    },
    like: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: 0,
      },
    ],
    follower: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
