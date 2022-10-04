const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please enter your comment'],
  },
  createdTime: {
    type: Date,
    default: Date.now,
  },
  updatedTime: {
    type: Date,
    default: Date.now,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  mentionedUserId: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  postId: { type: mongoose.Types.ObjectId, ref: 'Post' },
  parentCommentId: { type: mongoose.Types.ObjectId, ref: 'Comment' },
  like: [{ type: mongoose.Types.ObjectId, ref: 'User', default: 0 }],
});

module.exports = mongoose.model('Comment', CommentSchema);
