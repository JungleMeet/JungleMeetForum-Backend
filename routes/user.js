const { Router } = require('express');
const { getUserById } = require('../controllers/user');

const userRouter = Router();

userRouter.get('/:id', getUserById);

module.exports = userRouter;
