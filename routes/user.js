const { Router } = require('express');
const { getUserById, createUser, resetPassword, patchUser } = require('../controllers/user');

const userRouter = Router();

userRouter.get('/:id', getUserById);

userRouter.patch('/:id', patchUser);

userRouter.post('/', createUser);
userRouter.post('/reset/', resetPassword);

module.exports = userRouter;
