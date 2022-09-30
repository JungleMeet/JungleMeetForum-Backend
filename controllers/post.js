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

const patchPost = async (req, res) => {
  const {id} = req.params;

  try {
    const {title, content, hashtag, bgImg} = req.body;
    const now = new Date();
    const post = await Post.findOneAndUpdate({_id: id}, {title, content, hashtag, bgImg, updatedTime: now},{runValidators: true, new: true});
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

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findOneAndUpdate(
      { _id: id },
      {
        visible: false
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
    const post = new Post({ resourceId , postType: 'moviePost', createTime: now });
    const result = await post.save();

    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
}

module.exports = {
  createPost,
  patchPost,
  updatePost,
  getAllPosts,
  deletePost,
  createMoviePost,
};
