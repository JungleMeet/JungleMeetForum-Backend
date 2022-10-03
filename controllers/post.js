const { StatusCodes } = require('http-status-codes');
const Post = require('../models/Post');

const createPost = async (req, res) => {
  const { title, author, content, hashtag, bgImg } = req.body;

  try {
    const now = new Date();
    const post = new Post({ title, author, content, hashtag, bgImg, createTime: now });
    const thePost = await post.save();

    return res.status(StatusCodes.OK).json(thePost);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find();

    return res.status(StatusCodes.OK).json(allPosts);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;

  try {
    await Post.findByIdAndUpdate(
      { _id: id },
      {
        $set: post,
      },
      { runValidator: true, useFindAndModify: true, new: true }
    );
    return res.status(StatusCodes.OK).json(post);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByIdAndUpdate(
      { _id: id },
      {
        $inc: { viewNumber: 1 },
      },
      { runValidator: true, useFindAndModify: true, new: true }
    );

    return res.status(StatusCodes.OK).json(post);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

module.exports = {
  createPost,
  updatePost,
  getAllPosts,
  getPostById,
};
