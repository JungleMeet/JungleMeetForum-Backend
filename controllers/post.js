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
  console.log(id);
  try {
    const {title, content, hashtag, bgImg} = req.body;
    const post = await Post.findOneAndUpdate({_id: id}, {title, content, hashtag, bgImg},{new: true});

    return res.status(StatusCodes.OK).json(post);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

module.exports = {
  createPost,
  patchPost
};
