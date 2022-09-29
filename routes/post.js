const { Router } = require('express');
const auth = require('../middleware/auth');
const { createPost, updatePost, getAllPosts, createMoviePost } = require('../controllers/post');

const postRouter = Router();

postRouter.post('/', auth, createMoviePost);
postRouter.post('/', auth, createPost);


postRouter.get('/', getAllPosts);

postRouter.put('/:id', auth, updatePost);

module.exports = postRouter;
