const express = require('express');
const userRouter = require('./user');
const commentRouter = require('./comment');
const postRouter = require('./post');
const movieRouter = require('./movie');
const notificationRouter = require('./notification');
const emailRouter = require('./email');

const v1Router = express.Router();

v1Router.use('/users', userRouter);
v1Router.use('/comments', commentRouter);
v1Router.use('/posts', postRouter);
v1Router.use('/movies', movieRouter);
v1Router.use('/notifications', notificationRouter);
v1Router.use('/emails', emailRouter);

module.exports = v1Router;
