const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    triggerUserId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    targetPostId: {
      type: mongoose.Types.ObjectId,
      ref: 'Post',
    },
    targetCommentId: {
      type: mongoose.Types.ObjectId,
      ref: 'Comment',
    },
    action: {
      type: String,
      enum: ['replied', 'published', 'mentioned', 'liked', 'followed', 'commented'],
    },
    viewed: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
