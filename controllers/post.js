const { StatusCodes } = require('http-status-codes');
const Post = require('../models/Post');

const createPost = async (req, res) => {
  const { title, author, content, hashtag, bgImg } = req.body;

  try {
    const now = new Date();
    const post = new Post({ title, author, content, hashtag, bgImg, createdTime: now });
    const thePost = await post.save();

    return res.status(StatusCodes.OK).json(thePost);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const patchPost = async (req, res) => {
  const { id } = req.params;

  try {
    const { title, content, hashtag, bgImg } = req.body;
    const now = new Date();
    const post = await Post.findOneAndUpdate(
      { _id: id },
      { title, content, hashtag, bgImg, updatedTime: now },
      { runValidators: true, new: true }
    );
    return res.status(StatusCodes.OK).json(post);
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
        $inc: { viewCount: 1 },
      },
      { runValidator: true, useFindAndModify: true, new: true }
    );

    return res.status(StatusCodes.OK).json(post);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findOneAndUpdate(
      { _id: id },
      {
        visible: false,
      },
      { runValidator: true, new: true }
    );
    return res.status(StatusCodes.OK).json(post);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};
const createMoviePost = async (req, res) => {
  const { resourceId } = req.body;

  try {
    const now = new Date();
    const post = new Post({ resourceId, postType: 'moviePost', createdTime: now });
    const result = await post.save();

    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const checkLike = async (req, res) => {
  const { id, userId } = req.params;
  try {
    const post = await Post.findOne({ _id: id, like: { $eq: userId } });
    if (post) {
      return res.status(StatusCodes.OK).send('true');
    }
    return res.status(StatusCodes.OK).send('false');
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const getAllLikes = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    return res.status(StatusCodes.OK).json(post.like);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const likePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(id);
    await post.updateOne({ $push: { like: userId } }, { new: true, runValidators: true });
    return res.status(StatusCodes.OK).send('Liked');
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

// Makee sure to use with checkLike in front end to ensure the existence
const unlikePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(id);
    await post.updateOne({ $pull: { like: userId } }, { new: true, runValidators: true });
    return res.status(StatusCodes.OK).send('Unliked');
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

module.exports = {
  createPost,
  patchPost,
  updatePost,
  getAllPosts,
  getPostById,
  deletePost,
  createMoviePost,
  likePost,
  checkLike,
  getAllLikes,
  unlikePost,
};
