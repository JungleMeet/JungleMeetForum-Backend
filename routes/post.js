const { Router } = require('express');
const auth = require('../middleware/auth');
const {
  createPost,
  updatePost,
  getAllPosts,
  createMoviePost,
  likePost,
  checkLike,
  getAllLikes,
  unlikePost,
} = require('../controllers/post');

const postRouter = Router();

postRouter.post('/', auth, createMoviePost);
postRouter.post('/', auth, createPost);

postRouter.get('/', getAllPosts);

postRouter.put('/:id', auth, updatePost);

postRouter.patch('/:id', auth, likePost);
postRouter.patch('/unlike/:id', auth, unlikePost);

postRouter.get('/:id/likes/', auth, getAllLikes);
postRouter.get('/:id/likes/:userId', auth, checkLike);

module.exports = postRouter;
