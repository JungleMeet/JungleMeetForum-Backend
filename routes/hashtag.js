const { Router } = require('express');
const { searchHashtagbyName, createHashtag } = require('../controllers/hashtag');

const hashtagRouter = Router();

hashtagRouter.post('/', createHashtag);
hashtagRouter.get('/search', searchHashtagbyName);

module.exports = hashtagRouter;
