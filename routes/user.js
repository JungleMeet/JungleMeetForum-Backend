const { Router } = require('express');
const { getUserById, createUser } = require('../controllers/user');

const userRouter = Router();

userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);

module.exports = userRouter;
