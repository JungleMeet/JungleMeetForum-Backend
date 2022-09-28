const { Router } = require('express');
const auth = require('../middleware/auth');
const { createPost, patchPost } = require('../controllers/post');

const postRouter = Router();

postRouter.post('/', createPost);
postRouter.patch('/:id', auth, patchPost);


module.exports = postRouter;
