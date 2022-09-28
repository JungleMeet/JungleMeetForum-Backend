const { Router } = require('express');
const { createComment } = require('../controllers/comment');

const commentRouter = Router();

commentRouter.post('/', createComment);

module.exports = commentRouter;
