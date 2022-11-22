const { Router } = require('express');
const auth = require('../middleware/auth');
const adminGuard = require('../middleware/adminGuard');
const {
  createPost,
  updatePost,
  getPosts,
  toggleLikePost,
  checkLike,
  getAllLikes,
  toggleFollowPost,
  deletePost,
  getPostById,
  createMoviePost,
  patchPost,
  searchPostByKeyword,
} = require('../controllers/post');

const postRouter = Router();
postRouter.get('/', getPosts);
postRouter.get('/:postId', getPostById);
postRouter.post('/movie', createMoviePost);
postRouter.get('/search/all', searchPostByKeyword);
// endpoints before this line is open to everyone
postRouter.use(auth);
// endpoints after this line require valid token to access

postRouter.patch('/:postId', patchPost);

postRouter.post('/post', createPost);
postRouter.patch('/admin/:postId', adminGuard, deletePost);
postRouter.put('/:postId', updatePost);

postRouter.patch('/like/:postId', toggleLikePost);
postRouter.patch('/follow/:postId', toggleFollowPost);

postRouter.get('/:postId/likes/', getAllLikes);
postRouter.get('/:postId/likes/:userId', auth, checkLike);

module.exports = postRouter;
