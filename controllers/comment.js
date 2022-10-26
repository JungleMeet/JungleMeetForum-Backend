const { StatusCodes } = require('http-status-codes');
const Comment = require('../models/Comment');
const createNotification = require('../services/createNotification');

const createComment = async (req, res) => {
  const { content, author, postId, parentCommentId } = req.body;

  try {
    const comment = new Comment({ content, author, postId, parentCommentId });
    const ret = await comment.save();
    if (ret.isRootComment) {
      createNotification({
        actionType: 'comment',
        payload: {
          triggerUserId: author,
          targetPostId: postId,
          targetCommentId: ret._id,
        },
      });
    }

    return res.status(StatusCodes.OK).json(ret);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const getComments = async (req, res) => {
  try {
    const { postId } = req.query;
    if (postId) {
      const comments = await Comment.find({ postId });
      return res.status(StatusCodes.OK).json(comments);
    }
    const comments = await Comment.find();
    return res.status(StatusCodes.OK).json(comments);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const getCommentById = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);

    return res.status(StatusCodes.OK).json(comment);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const deleteCommentById = async (req, res) => {
  const { commentId } = req.params;
  const { visible } = req.body;

  try {
    await Comment.findByIdAndUpdate(
      { _id: commentId },
      [{ $set: { visible: { $toBool: visible } } }],
      {
        runValidator: true,
        useFindAndModify: true,
        new: true,
      }
    );
    return res.status(StatusCodes.OK).json({ message: 'Your comment has already been deleted!' });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content, mentionUserId } = req.body;
  try {
    const comment = await Comment.findById(commentId);
    await comment.updateOne(
      { $set: { content, mentionUserId } },
      { runValidator: true, new: true }
    );
    return res.status(StatusCodes.OK).json('updated');
  } catch (err) {
    return res.status(StatusCodes.err).json(err);
  }
};

const toggleLikeOnComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req;

  const comment = await Comment.findById(commentId).exec();
  if (!comment) return res.sendStatus(StatusCodes.NOT_FOUND);
  // the types are not correct, one is object id the other is string, but it works in mongoose
  const userLikedThis = comment.like.includes(userId);
  if (userLikedThis) {
    comment.like.pull(userId);
  } else {
    comment.like.push(userId);
  }
  await comment.save();
  // userLikedThis has changed, if user has not like the post before, now he likes it
  if (!userLikedThis) {
    createNotification({
      actionType: 'likeComment',
      payload: {
        notifiedUserId: comment.author,
        triggerUserId: userId,
        targetCommentId: commentId,
        targetPostId: comment.postId,
      },
    });
  }

  return res.status(StatusCodes.OK).json({
    commentId,
    likeCount: comment.likeCount,
    userId,
    userLikedThis: !userLikedThis,
  });
};

module.exports = {
  createComment,
  getComments,
  getCommentById,
  deleteCommentById,
  updateComment,
  toggleLikeOnComment,
};
