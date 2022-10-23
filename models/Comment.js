const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    text: {
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
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
  { timestamps: true }
);

CommentSchema.virtual('likeCount').get(function () {
  return this.like.length;
});

module.exports = mongoose.model('Comment', CommentSchema);
