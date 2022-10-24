const { Router } = require('express');
const auth = require('../middleware/auth');
const adminGuard = require('../middleware/adminGuard');

const {
  createComment,
  getComments,
  getCommentById,
  deleteCommentById,
  updateComment,
  toggleLikeOnComment,
} = require('../controllers/comment');

const commentRouter = Router();

commentRouter.get('/', getComments);
commentRouter.get('/:commentId', getCommentById);

// endpoints before this line is open to everyone
commentRouter.use(auth);
// endpoints after this line require valid token to access

commentRouter.post('/', createComment);
commentRouter.put('/:commentId', updateComment);
// Wd don't delete comment but update "visible" value to false and then the comment won't show anymore.
// only admin can delete a comment
commentRouter.put('/admin/:commentId', adminGuard, deleteCommentById);
commentRouter.patch('/like/:commentId', toggleLikeOnComment);

module.exports = commentRouter;
