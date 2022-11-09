const { Router } = require('express');
const auth = require('../middleware/auth');

const {
  getUserById,
  createUser,
  resetPassword,
  getAllUsers,
  updateUser,
  patchUser,
  userLogIn,
  toggleFollowing,
  getUserProfile,
  verifyToken,
} = require('../controllers/user');

const userRouter = Router();

userRouter.get('/verify', verifyToken);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.get('/', getAllUsers);
userRouter.post('/login', userLogIn);
userRouter.get('/:userId/profile', getUserProfile);
// endpoints before this line is open to everyone
userRouter.use(auth);
// endpoints after this line require valid token to access

userRouter.put('/following/', toggleFollowing);
userRouter.patch('/', patchUser);
userRouter.post('/reset/', resetPassword);
userRouter.put('/', updateUser);

module.exports = userRouter;
