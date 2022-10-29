const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    notifiedUserId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
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
      enum: [
        'replied',
        'published',
        'mentioned',
        'likedComment',
        'likedPost',
        'followed',
        'commented',
      ],
      required: true,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
    // decide if the word 'your' should be used
    useSecondPersonNarrative: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
