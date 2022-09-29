const { Router } = require('express');
const auth = require('../middleware/auth');
const { createPost, updatePost, getAllPosts, patchPost } = require('../controllers/post');

const postRouter = Router();

postRouter.patch('/:id', auth, patchPost);
postRouter.post('/', auth, createPost);


postRouter.get('/', getAllPosts);

postRouter.put('/:id', auth, updatePost);

module.exports = postRouter;
