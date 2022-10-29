const mongoose = require('mongoose');

const options = {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please enter your comment'],
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
  },
  options
);

CommentSchema.virtual('likeCount').get(function () {
  return this.like.length;
});

CommentSchema.virtual('isRootComment').get(function () {
  return !this.parentCommentId;
});

module.exports = mongoose.model('Comment', CommentSchema);
