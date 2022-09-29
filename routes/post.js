const { Router } = require('express');
const auth = require('../middleware/auth');
const { createPost, updatePost, getAllPosts, patchPost, createMoviePost } = require('../controllers/post');

const postRouter = Router();

postRouter.patch('/:id', auth, patchPost);


postRouter.post('/', auth, createMoviePost);
postRouter.post('/', auth, createPost);


postRouter.get('/', getAllPosts);

postRouter.put('/:id', auth, updatePost);

module.exports = postRouter;
