const { Router } = require('express');
const auth = require('../middleware/auth');
const {
  createPost,
  updatePost,
  getAllPosts,
  createMoviePost,
  likePost,
} = require('../controllers/post');

const postRouter = Router();

postRouter.post('/', auth, createMoviePost);
postRouter.post('/', auth, createPost);

postRouter.get('/', getAllPosts);

postRouter.put('/:id', auth, updatePost);

postRouter.patch('/:id', auth, likePost);
module.exports = postRouter;
