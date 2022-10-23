const { StatusCodes } = require('http-status-codes');
const Post = require('../models/Post');

const createPost = async (req, res) => {
  const { title, content, hashtag, bgImg } = req.body;
  const { userId } = req;

  try {
    if (title && content) {
      const now = new Date();
      const post = new Post({ title, author: userId, content, hashtag, bgImg, createdTime: now });
      const result = await post.save();

      if (result) {
        return res.status(StatusCodes.OK).json(result);
      }
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Result not found' });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Title and content cannot be empty!' });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const patchPost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req;

  try {
    const { title, content, hashtag, bgImg } = req.body;
    if (title && content) {
      const now = new Date();
      const post = await Post.findOneAndUpdate(
        { _id: postId, author: userId },
        { title, content, hashtag, bgImg, updatedTime: now },
        { runValidators: true, new: true }
      );
      if (post) {
        return res.status(StatusCodes.OK).json(post);
      }
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Only author can update post!' });
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Title and content cannot be empty!' });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const getPosts = async (req, res) => {
  try {
    const { displayNumber } = req.query;
    if (req.query.sortBy === 'views') {
      const top10Posts = (await Post.find().sort({ viewNumber: 'desc' })).slice(0, displayNumber);
      return res.status(StatusCodes.OK).json(top10Posts);
    } if (req.query.sortBy === 'createdTime') {
      const top10Posts = (await Post.find().sort({ createdTime: 'desc' })).slice(0, displayNumber);
      return res.status(StatusCodes.OK).json(top10Posts);
    } 
      const allPosts = (await Post.find()).slice(0, displayNumber);
      return res.status(StatusCodes.OK).json(allPosts);
    
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, content, hashtag, bgImg } = req.body;
  const { userId } = req;

  if (!title || !content) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Title and content cannot be empty!' });
  }

  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId, author: userId },
      { $set: { title, content, hashtag, bgImg } },
      { runValidator: true, new: true }
    );

    if (updatedPost) {
      return res.status(StatusCodes.OK).json(updatedPost);
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Only author can update post!' });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findByIdAndUpdate(
      { _id: postId },
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
  const { postId } = req.params;

  try {
    await Post.findOneAndUpdate(
      { _id: postId },
      {
        visible: false,
      },
      { runValidator: true, new: true }
    );
    return res.status(StatusCodes.OK).json({ message: 'Successfully deleted' });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const createMoviePost = async (req, res) => {
  const { resourceId } = req.body;

  try {
    if (resourceId) {
      const now = new Date();
      const post = new Post({ resourceId, postType: 'moviePost', createdTime: now });
      const result = await post.save();
      return res.status(StatusCodes.OK).json(result);
    }
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'resourceId cannot be empty!' });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const checkLike = async (req, res) => {
  const { postId, userId } = req.params;
  try {
    const post = await Post.findOne({ _id: postId, like: { $eq: userId } });
    if (post) {
      return res.status(StatusCodes.OK).json({ message: 'true' });
    }
    return res.status(StatusCodes.OK).json({ message: 'false' });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const getAllLikes = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    return res.status(StatusCodes.OK).json(post.like);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const likePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    await post.updateOne({ $push: { like: userId } }, { new: true, runValidators: true });
    return res.status(StatusCodes.OK).json({ message: 'Liked' });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

// Make sure to use with checkLike in front end to ensure the existence
const unlikePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    await post.updateOne({ $pull: { like: userId } }, { new: true, runValidators: true });
    return res.status(StatusCodes.OK).json({ message: 'Unliked' });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

module.exports = {
  createPost,
  patchPost,
  updatePost,
  getPosts,
  getPostById,
  deletePost,
  createMoviePost,
  likePost,
  checkLike,
  getAllLikes,
  unlikePost,
};
