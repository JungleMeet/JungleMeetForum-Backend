const { Router } = require('express');
const auth = require('../middleware/auth');
const { createPost, updatePost, getAllPosts, getPostById } = require('../controllers/post');

const postRouter = Router();

postRouter.post('/', createPost);
postRouter.get('/', getAllPosts);
postRouter.get('/:id', getPostById);

postRouter.put('/:id', auth, updatePost);

module.exports = postRouter;
