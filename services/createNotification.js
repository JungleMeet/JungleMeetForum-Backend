const { isEmpty } = require('lodash');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

const sendNotification = (notifiedUsers) => {
  // placeholder function
  // console.log('notifiedUsers', notifiedUsers);
  const notifyArray = notifiedUsers.map((notifiedUser) => global.onlineUsers.get(notifiedUser));
  console.log('notifyArray', notifyArray);
  global.io.to(notifyArray).emit('message', 'hello');
  console.log('success');
};

const createNotification = async ({ actionType, payload }) => {
  const { notifiedUserId, triggerUserId, targetPostId, targetCommentId } = payload;

  const newNotifications = [];

  switch (actionType) {
    case 'createPost': {
      const { follower } = await User.findById(triggerUserId).exec();
      if (isEmpty(follower)) return;

      follower.forEach((userId) => {
        newNotifications.push({
          notifiedUserId: userId,
          triggerUserId,
          targetPostId,
          action: 'published',
        });
      });
      break;
    }

    case 'follow': {
      newNotifications.push({
        notifiedUserId,
        triggerUserId,
        action: 'followed',
      });
      break;
    }

    case 'comment': {
      const { parentCommentId } = await Comment.findById(targetCommentId).exec();
      const { author, follower } = await Post.findById(targetPostId).exec();

      // movie posts do not have authors. we will only notify user post authors
      // if the author replies to its own post, no notification will be created
      if (author) {
        const postAuthor = author;
        if (postAuthor.toString() !== triggerUserId.toString()) {
          newNotifications.push({
            notifiedUserId: postAuthor,
            triggerUserId,
            targetPostId,
            targetCommentId,
            action: 'commented',
            useSecondPersonNarrative: true, // the post author will receive "someone commented on your post"
          });
        }
      }

      // notify the post followers
      if (!isEmpty(follower)) {
        follower.forEach((user) => {
          newNotifications.push({
            notifiedUserId: user,
            triggerUserId,
            targetPostId,
            targetCommentId,
            action: 'commented',
          });
        });
      }

      // notify the parent comment author (if any)
      if (parentCommentId) {
        const { author: parentCommentAuthor } = await Comment.findById(parentCommentId).exec();
        // only send notification when you reply to other people's comments
        if (parentCommentAuthor.toString() !== triggerUserId.toString()) {
          newNotifications.push({
            notifiedUserId: parentCommentAuthor,
            triggerUserId,
            targetPostId,
            targetCommentId,
            action: 'replied',
            useSecondPersonNarrative: true, // the post author will receive "someone replied to your comment"
          });
        }
      }
      break;
    }

    // mention is a bit hard

    // like post
    case 'likePost': {
      newNotifications.push({
        notifiedUserId,
        triggerUserId,
        targetPostId,
        action: 'likedPost',
        useSecondPersonNarrative: true,
      });
      break;
    }

    // like comment
    case 'likeComment': {
      newNotifications.push({
        notifiedUserId,
        triggerUserId,
        targetCommentId,
        targetPostId,
        action: 'likedComment',
        useSecondPersonNarrative: true,
      });
      break;
    }
    default:
  }

  await Notification.insertMany(newNotifications);

  const notifiedUsers = newNotifications.map((notification) =>
    notification.notifiedUserId.toString()
  );

  sendNotification(notifiedUsers);
};

module.exports = createNotification;
