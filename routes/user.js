const { Router } = require('express');
const { getUserById, createUser } = require('../controllers/user');
// import patch user
const { patchUser } = require('../controllers/user');

const userRouter = Router();

userRouter.get('/:id', getUserById);

userRouter.post('/', createUser);

// patch user
userRouter.patch('/:id', patchUser);

module.exports = userRouter;
