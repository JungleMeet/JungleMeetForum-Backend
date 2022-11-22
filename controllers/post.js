const { StatusCodes } = require('http-status-codes');
const Post = require('../models/Post');
const { convertHtmlFormat } = require('../utils/convertHtmlEntities');
const createNotification = require('../services/createNotification');
const { discussionListData, processPostSearchResult } = require('../utils/formatDiscussionData');
const { htmlEntities } = require('../utils/convertHtmlEntities');

const createPost = async (req, res) => {
  const { title, content, hashtag, hashtags, bgImg } = req.body;
  const { userId } = req;

  try {
    if (title && content) {
      const post = new Post({ title, author: userId, content, hashtag, hashtags, bgImg });
      const result = await post.save();
      createNotification({
        actionType: 'createPost',
        payload: {
          triggerUserId: userId,
          targetPostId: result._id,
        },
      });
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
    const { title, content, hashtag, hashtags, bgImg } = req.body;
    if (title && content) {
      const post = await Post.findOneAndUpdate(
        { _id: postId, author: userId },
        { title, content, hashtag, hashtags, bgImg },
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
    const { nPerPage, pageNumber, sortBy, userId } = req.query;
    const sortByOptions = sortBy === 'views' ? { viewNumber: 'desc' } : { createdAt: 'desc' };

    if (userId) {
      const matchedPosts = await Post.find({
        visible: true,
        author: userId,
        postType: 'userPost',
      })
        .sort(sortByOptions)
        .skip(pageNumber > 0 ? pageNumber * nPerPage : 0)
        .limit(nPerPage)
        .populate('commentCount')
        .populate({ path: 'author', select: 'name avatar' });
      const matchPostsRightFormat = matchedPosts.map((post) => discussionListData(post));
      const convertHtmlContentPosts = convertHtmlFormat(matchPostsRightFormat);
      return res
        .status(StatusCodes.OK)
        .json({ length: matchedPosts.length, data: convertHtmlContentPosts });
    }

    if (sortBy) {
      const matchedPosts = await Post.find({
        visible: true,
        postType: 'userPost',
      })
        .sort(sortByOptions)
        .skip(pageNumber > 0 ? pageNumber * nPerPage : 0)
        .limit(nPerPage)
        .populate('commentCount')
        .populate({ path: 'author', select: 'name avatar' });
      const matchPostsRightFormat = matchedPosts.map((post) => discussionListData(post));
      const length = await Post.find({ visible: true, postType: 'userPost' }).count();
      const convertHtmlContentPosts = convertHtmlFormat(matchPostsRightFormat);
      return res.status(StatusCodes.OK).json({ length, data: convertHtmlContentPosts });
    }

    const matchedPosts = await Post.find({
      visible: true,
      postType: 'userPost',
    })
      .skip(pageNumber > 0 ? pageNumber * nPerPage : 0)
      .limit(nPerPage)
      .populate('commentCount ')
      .populate({ path: 'author', select: 'name avatar' });
    const matchPostsRightFormat = matchedPosts.map((post) => discussionListData(post));
    const length = await Post.find({ visible: true, postType: 'userPost' }).count();

    const convertHtmlContentPosts = convertHtmlFormat(matchPostsRightFormat);

    return res.status(StatusCodes.OK).json({ length, data: convertHtmlContentPosts });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, content, hashtag, hashtags, bgImg } = req.body;
  const { userId } = req;

  if (!title || !content) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Title and content cannot be empty!' });
  }

  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId, author: userId },
      { $set: { title, content, hashtag, hashtags, bgImg } },
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
    post.content = htmlEntities(post.content);
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
      const post = await Post.findOneAndUpdate(
        { resourceId },
        {
          $setOnInsert: { resourceId, postType: 'moviePost' },
        },
        {
          returnOriginal: false,
          upsert: true,
        }
      );
      return res.status(StatusCodes.OK).json(post);
    }
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'resourceId cannot be empty!' });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const checkLike = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req;
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

const toggleLikePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req;

  try {
    const post = await Post.findById(postId);
    const userLikedThis = post.like.includes(userId);
    if (userLikedThis) {
      post.like.pull(userId);
    } else {
      post.like.push(userId);
    }
    await post.save();
    // await post.updateOne({ $push: { like: userId } }, { new: true, runValidators: true });
    if (!userLikedThis) {
      createNotification({
        actionType: 'likePost',
        payload: {
          notifiedUserId: post.author,
          triggerUserId: userId,
          targetPostId: postId,
        },
      });
    }
    return res.status(StatusCodes.OK).json({
      postId,
      like: post.like,
      userId,
      userLikedThis: !userLikedThis,
    });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const toggleFollowPost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req;

  try {
    const post = await Post.findById(postId);
    const userFollowedThis = post.follower.includes(userId);
    if (userFollowedThis) {
      post.follower.pull(userId);
    } else {
      post.follower.push(userId);
    }
    await post.save();
    // await post.updateOne({ $push: { like: userId } }, { new: true, runValidators: true });
    return res.status(StatusCodes.OK).json({
      postId,
      follower: post.follower,
      userId,
      userFollowedThis: !userFollowedThis,
    });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const searchPostByKeyword = async (req, res) => {
  const { keyword, page, limit } = req.query;
  if (!keyword) return res.status(StatusCodes.OK).json([]);

  try {
    const result = await Post.find(
      { $text: { $search: keyword, $language: 'en' } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .skip(page > 0 ? (page - 1) * limit : 0)
      .limit(limit)
      .select('title author hashtag createdAt like viewNumber')
      .populate({ path: 'author', select: 'name avatar' })
      .populate('commentCount')
      .exec();

    const processedResults = result.map((post) => processPostSearchResult(post));
    return res.status(StatusCodes.OK).json(processedResults);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error);
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
  toggleLikePost,
  checkLike,
  getAllLikes,
  toggleFollowPost,
  searchPostByKeyword,
};
