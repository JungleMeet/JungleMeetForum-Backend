const express = require('express');
const userRouter = require('./user');
const commentRouter = require('./comment');

const v1Router = express.Router();

v1Router.use('/users', userRouter);
v1Router.use('/comments', commentRouter);

module.exports = v1Router;
