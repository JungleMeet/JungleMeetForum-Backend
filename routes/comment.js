const { Router } = require('express');
const auth = require('../middleware/auth');
const { createComment, getAllComments, deleteCommentById } = require('../controllers/comment');

const commentRouter = Router();

commentRouter.post('/', createComment);
commentRouter.get('/', getAllComments);

// Wd don't delete comment but update "visible" value to false and then the comment won't show anymore.
commentRouter.put('/delete/:id', auth, deleteCommentById);

module.exports = commentRouter;
