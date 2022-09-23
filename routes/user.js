const { Router } = require('express');
const { getUserById, createUser } = require('../controllers/user');
// import patch user
const { patchUser } = require('../controllers/user');

const userRouter = Router();

userRouter.get('/:id', getUserById);

// patch user
userRouter.patch('/:id', patchUser);

userRouter.post('/', createUser);

module.exports = userRouter;
