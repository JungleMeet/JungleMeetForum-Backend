const { StatusCodes } = require('http-status-codes');
const Post = require('../models/Post');

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - bgImg
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *           description: The Auto-generated id of a post
 *         title:
 *           type: string
 *           description: title of the post
 *         content:
 *           type: string
 *           description: content of the post
 *         bgImg:
 *           type: string
 *           description: background image of the the post
 *         hashtag:
 *           type: string
 *           description: tag other user
 *         author:
 *           type: string
 *           description: author of the post
 *         createdTime:
 *           type: string
 *           description: the time of creating the post
 *         updatedTime:
 *           type: string
 *           description: the time of updating the post
 *         visible:
 *           type: boolean
 *           description: status of deleting the post
 *         resourceId:
 *           type: string
 *           description: resource id of the post
 *         viewCount:
 *           type: number
 *           description: the number of the post views
 *         postType:
 *           type: string
 *           description: the type of the post
 *         follower:
 *           type: array
 *           items:
 *             type: string
 *           description: follower of the user
 *         like:
 *           type: array
 *           items:
 *             type: string
 *           description: the number of post like
 *       example:
 *         _id: 63338ae4d11e553b55138c9e
 *         title: abd
 *         content: 1234
 *         createdTime: 2022-10-03T01:33:24.275Z
 *         bgImg: xxxxx
 *         visible: true
 *         updatedTime: 2022-09-30T06:01:26.183Z
 *         viewCount: 111
 *         postType: userPost
 *         like: []
 *         author: 6332d81195b55eda2a612059
 *         follower: [6332d81195b55eda2a612058, 6332d81195b55eda2a612057]
 * paths:
 *   /posts:
 *     post:
 *       tags:
 *         - post
 *       summary: Add a new post
 *       description: Return created post
 *       operationId: createPost
 *       requestBody:
 *         description:
 *           Add a new post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post{title, content, author, bgImg}'
 *       responses:
 *         '200':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Post'
 *         '404':
 *           description: Not found
 */

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

  const post = await Post.findById(id).exec();
  if (!post) return res.sendStatus(StatusCodes.NOT_FOUND);

  try {
    const { title, content, hashtag, bgImg } = req.body;
    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      { title, content, hashtag, bgImg },
      { runValidator: true, useFindAndModify: true, new: true }
    );
    return res.status(StatusCodes.OK).json(updatedPost);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json(err);
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
