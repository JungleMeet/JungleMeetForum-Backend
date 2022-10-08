const { Router } = require('express');
const auth = require('../middleware/auth');
const {
  getUserById,
  createUser,
  resetPassword,
  getAllUsers,
  updateUser,
  patchUser,
  toggleFollowing,
} = require('../controllers/user');

const userRouter = Router();

userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);
userRouter.get('/', getAllUsers);

// endpoints before this line is open to everyone
userRouter.use(auth);
// endpoints after this line require valid token to access

userRouter.put('/following/', toggleFollowing);
userRouter.patch('/:id', patchUser);
userRouter.post('/reset/', resetPassword);
userRouter.put('/', updateUser);

module.exports = userRouter;
