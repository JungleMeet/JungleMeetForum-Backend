const { Router } = require('express');
const auth = require('../middleware/auth');
const {
  createPost,
  updatePost,
  getAllPosts,
  deletePost,
  createMoviePost,
  patchPost,
} = require('../controllers/post');

const postRouter = Router();
postRouter.get('/', getAllPosts);

// endpoints before this line is open to everyone
postRouter.use(auth);
// endpoints after this line require valid token to access

postRouter.patch('/:id', patchPost);
postRouter.post('/', createMoviePost);
postRouter.post('/', createPost);
postRouter.patch('/:id', deletePost);
postRouter.put('/:id', updatePost);

module.exports = postRouter;
