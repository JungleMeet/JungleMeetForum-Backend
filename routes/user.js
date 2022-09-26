const { Router } = require('express');
const auth = require('../middleware/auth');
const { getUserById, createUser, resetPassword } = require('../controllers/user');

const userRouter = Router();

userRouter.get('/:id', auth, getUserById);
userRouter.post('/', createUser);
userRouter.post('/reset/', resetPassword);

module.exports = userRouter;
