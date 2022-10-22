const express = require('express');
const userRouter = require('./user');
const commentRouter = require('./comment');
const postRouter = require('./post');
const movieRouter = require('./movie');

const v1Router = express.Router();

v1Router.use('/users', userRouter);
v1Router.use('/comments', commentRouter);
v1Router.use('/posts', postRouter);
v1Router.use('/movies', movieRouter);

module.exports = v1Router;
