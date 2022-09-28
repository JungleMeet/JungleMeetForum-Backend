const { Router } = require('express');
const auth = require('../middleware/auth');
const {
  getUserById,
  createUser,
  resetPassword,
  getAllUsers,
  updateUser,
  patchUser,
} = require('../controllers/user');

const userRouter = Router();

userRouter.get('/:id', getUserById);

userRouter.get('/:id', auth, getUserById);
userRouter.patch('/:id', patchUser);

userRouter.post('/', createUser);
userRouter.post('/reset/', resetPassword);
userRouter.get('/', getAllUsers);

userRouter.put('/:id', updateUser);

module.exports = userRouter;
