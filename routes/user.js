const { Router } = require('express');
const { getUserById, createUser, resetPassword, updateUser } = require('../controllers/user');

const userRouter = Router();

userRouter.get('/:id', getUserById);

userRouter.post('/', createUser);
userRouter.post('/reset/', resetPassword);

userRouter.put('/:id', updateUser);

module.exports = userRouter;
