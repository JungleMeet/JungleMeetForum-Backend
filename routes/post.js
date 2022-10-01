const { Router } = require('express');
const auth = require('../middleware/auth');
const {
  createPost,
  updatePost,
  getAllPosts,
  likePost,
  checkLike,
  getAllLikes,
  unlikePost,
  deletePost,
  createMoviePost,
  patchPost,
} = require('../controllers/post');

const postRouter = Router();

postRouter.patch('/:id', auth, patchPost);

postRouter.post('/', auth, createMoviePost);
postRouter.post('/', auth, createPost);

postRouter.patch('/:id', auth, deletePost);

postRouter.get('/', getAllPosts);

postRouter.put('/:id', auth, updatePost);

postRouter.patch('/:id', auth, likePost);
postRouter.patch('/unlike/:id', auth, unlikePost);

postRouter.get('/:id/likes/', auth, getAllLikes);
postRouter.get('/:id/likes/:userId', auth, checkLike);

module.exports = postRouter;
