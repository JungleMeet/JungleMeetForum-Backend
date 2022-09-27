const { Router } = require('express');
const { createPost } = require('../controllers/post');

const postRouter = Router();

postRouter.post('/', createPost);


module.exports = postRouter;
