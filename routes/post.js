const { Router } = require('express');
const auth = require('../middleware/auth');
const { createPost, updatePost, getAllPosts, deletePost } = require('../controllers/post');

const postRouter = Router();

postRouter.post('/', auth, createPost);
postRouter.patch('/:id', auth, deletePost);

postRouter.get('/', getAllPosts);

postRouter.put('/:id', auth, updatePost);

module.exports = postRouter;
