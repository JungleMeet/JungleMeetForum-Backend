const { StatusCodes } = require('http-status-codes');
const Comment = require('../models/Comment');

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - text
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *           description: The Auto-generated id of a post
 *         text:
 *           type: string
 *           description: text of the user
 *         author:
 *           type: string
 *           description: author of the user
 *         createdTime:
 *           type: string
 *           description: the time of creating the user
 *         updatedTime:
 *           type: string
 *           description: the time of updating the user
 *         visible:
 *           type: boolean
 *           description: role of the user
 *         mentionedUserId:
 *           type: array
 *           items:
 *             type: string
 *           description: mentioned UserId of the user
 *         postId:
 *           type: array
 *           items:
 *             type: string
 *           description: the post Id of the user
 *         parentCommentId:
 *           type: array
 *           items:
 *             type: string
 *           description: parent Comment Id of the user
 *         like:
 *           type: array
 *           items:
 *             type: string
 *           description: the like of the user
 *       example:
 *         _id: 6333bac93edc0fe86c036b16
 *         mentionedUserId: []
 *         text:
 *         author: []
 *         visible: null
 *         createTime: 2022-09-27T11:01:37.487Z
 *         updateTime: 2022-09-30T14:26:18.296Z
 *         __v: 24
 *         createdTime: 2022-10-03T06:40:03.763Z
 *         updatedTime: 2022-10-03T06:40:03.763Z
 *         like: []
 * paths:
 *   /comments/{id}:
 *     get:
 *       tags:
 *         - comment
 *       summary: Find comment by id
 *       description: Return a single comment
 *       operationId: getCommentById
 *       parameters:
 *         - name: id
 *           in: path
 *           description: ID of comment to return
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Comment'
 *         '404':
 *           description: Comment not found
 */
const createComment = async (req, res) => {
  const { text, author, postId } = req.body;
  try {
    const comment = new Comment({ text, author, postId });
    const ret = await comment.save();

    return res.status(StatusCodes.OK).json(ret);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();

    return res.status(StatusCodes.OK).json(comments);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const getCommentById = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id);

    return res.status(StatusCodes.OK).json(comment);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};
/**
 * @swagger
 *   /comments/delete/{id}:
 *     get:
 *       tags:
 *         - comment
 *       summary: Delete comment by id
 *       description: Return a single comment
 *       operationId: getCommentById
 *       parameters:
 *         - name: id
 *           in: path
 *           description: ID of comment to return
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Comment'
 *         '404':
 *           description: Comment not found
 */
const deleteCommentById = async (req, res) => {
  const { id } = req.params;
  const { visible } = req.body;

  try {
    await Comment.findByIdAndUpdate({ _id: id }, [{ $set: { visible: { $toBool: visible } } }], {
      runValidator: true,
      useFindAndModify: true,
      new: true,
    });
    return res.status(StatusCodes.OK).json('Your comment has already been deleted!');
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const { text, mentionUserId } = req.body;
  try {
    const comment = Comment.findById(id);
    await comment.updateOne({ $set: { text, mentionUserId } }, { runValidator: true, new: true });
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

  return res.status(StatusCodes.OK).json({
    commentId,
    likeCount: comment.likeCount,
    userId,
    userLikedThis: !userLikedThis,
  });
};

module.exports = {
  createComment,
  getAllComments,
  getCommentById,
  deleteCommentById,
  updateComment,
  toggleLikeOnComment,
};
