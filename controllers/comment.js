const { StatusCodes } = require('http-status-codes');
const Comment = require('../models/Comment');

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

const getCommentById = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id);

    return res.status(StatusCodes.OK).json(comment);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

module.exports = {
  createComment,
  getCommentById,
};
