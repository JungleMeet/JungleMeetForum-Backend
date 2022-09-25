const { Router } = require('express');
const { getUserById, createUser, resetPassword, getAllUsers } = require('../controllers/user');

const userRouter = Router();

userRouter.get('/:id', getUserById);

userRouter.post('/', createUser);
userRouter.post('/reset/', resetPassword);
userRouter.get('/', getAllUsers);
module.exports = userRouter;
