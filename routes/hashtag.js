const { Router } = require('express');
const {
  searchHashtagbyName,
  createHashtag,
  getPostByHashTagId,
} = require('../controllers/hashtag');

const hashtagRouter = Router();

hashtagRouter.post('/', createHashtag);
hashtagRouter.get('/search', searchHashtagbyName);
hashtagRouter.get('/:HashtagId', getPostByHashTagId);

module.exports = hashtagRouter;
