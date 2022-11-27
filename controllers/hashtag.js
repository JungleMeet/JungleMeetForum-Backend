const { StatusCodes } = require('http-status-codes');
const Hashtag = require('../models/Hashtag');
const Post = require('../models/Post');
const { convertHtmlFormat } = require('../utils/convertHtmlEntities');
const { discussionListData } = require('../utils/formatDiscussionData');

const searchHashtagbyName = async (req, res) => {
  try {
    const { category } = req.query;
    if (category) {
      const regex = new RegExp(`^${category}`);
      const createHashtag = await Hashtag.find({
        category: { $regex: regex },
      })
        .limit(20)
        .exec();

      if (createHashtag) {
        return res.status(StatusCodes.OK).json(createHashtag);
      }
    }

    return res.status(StatusCodes.OK).json([]);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const createHashtag = async (req, res) => {
  const { category } = req.body;

  try {
    const categoryExist = await Hashtag.findOne({ category });
    if (categoryExist) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'Hashtag already existed' });
    }

    const hashtag = new Hashtag({ category });
    const result = await hashtag.save();

    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const getPostByHashTagId = async (req, res) => {
  try {
    const { HashtagId } = req.params;

    if (HashtagId) {
      const matchedPosts = await Post.find({
        hashtags: HashtagId,
        ref: 'Hashtag',
      });

      const matchPostsRightFormat = matchedPosts.map((post) => discussionListData(post));
      const convertHtmlContentPosts = convertHtmlFormat(matchPostsRightFormat);
      return res.status(StatusCodes.OK).json({ convertHtmlContentPosts });
    }
    const length = await Post.find({ visible: true, postType: 'userPost' }).count();

    return res.status(StatusCodes.OK).json({ length });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

module.exports = { searchHashtagbyName, createHashtag, getPostByHashTagId };
