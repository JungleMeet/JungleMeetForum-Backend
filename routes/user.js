const { Router } = require('express');
const { getUserById, createUser, getAllUsers } = require('../controllers/user');

const userRouter = Router();

userRouter.get('/:id', getUserById);
userRouter.get('/', getAllUsers);

userRouter.post('/', createUser);

module.exports = userRouter;
