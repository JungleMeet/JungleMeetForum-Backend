const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Email = require('../models/Email');
const createNotification = require('../services/createNotification');

const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    return res.status(StatusCodes.OK).json(user);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const createUser = async (req, res) => {
  const { name, password, email, avatar, bgImg } = req.body;

  try {
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'Email already existed' });
    }

    const nameExist = await User.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (nameExist) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'Name already existed' });
    }

    const user = new User({ name, password, email, avatar, bgImg });
    const ret = await user.save();

    return res.status(StatusCodes.OK).json(ret);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = await User.find();

    return res.status(StatusCodes.OK).json(user);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const resetPassword = async (req, res) => {
  const id = req.userId;
  const { newPassword, oldPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (user.password === oldPassword) {
      await user.updateOne({ $set: { password: newPassword } }, { new: true, runValidators: true });
      return res.status(StatusCodes.OK).json({ message: 'Password changed successfully!' });
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Wrong password, try again' });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Password should be 6 characters at least, try again' });
    }
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const emailResetPassword = async (req, res) => {
  const { email, newPwd } = req.body;
  const { code } = req.query;
  // console.log(code)
  try {
    const user = await User.findOne({ email });
    // const result = await Email.findOne({email,code});
    if (user) {
      const result = await Email.findOne({ email, code });
      if (result) {
        await user.updateOne({ $set: { password: newPwd } }, { new: true, runValidators: true });
        return res.status(StatusCodes.OK).json({ message: 'Password changed successfully!' });
      }
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Reset password already expired' });
    }
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'No account with that email has been found' });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const updateUser = async (req, res) => {
  const { userId } = req;

  const { name, email, avatar, bgImg } = req.body;

  try {
    const oldUser = await User.findById(userId);
    await User.updateOne(
      { _id: userId },
      {
        name: name || oldUser.name,
        email: email || oldUser.name,
        avatar: avatar || oldUser.avatar,
        bgImg: bgImg || oldUser.bgImg,
      },
      { runValidators: true }
    );
    const newUser = await User.findById(userId);

    return res.status(StatusCodes.OK).json(newUser);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const patchUser = async (req, res) => {
  const { userId } = req;
  const { name, email, avatar, bgImg } = req.body;
  const modifiedUser = { name, email, avatar, bgImg };
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, modifiedUser, {
      runValidator: true,
      new: true,
      returnOriginal: false,
    });
    await user.save();
    return res.status(StatusCodes.OK).json(user);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json('error', err);
  }
};

const toggleFollowing = async (req, res) => {
  const { following } = req.body;
  const { userId } = req;

  const user = await User.findById(userId).exec();
  const followingAuthor = await User.findById(following).exec();

  if (!followingAuthor) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Cannot find the following author!' });
  }
  try {
    if (!user.following.includes(following)) {
      await user.updateOne({ $push: { following } }, { new: true, runValidators: true });
      await followingAuthor.updateOne(
        { $push: { follower: userId } },
        { new: true, runValidators: true }
      );
      createNotification({
        actionType: 'follow',
        payload: {
          notifiedUserId: followingAuthor._id,
          triggerUserId: userId,
        },
      });
      return res.status(StatusCodes.OK).json({ message: 'Add following succeed!' });
    }
    await user.updateOne({ $pull: { following } }, { new: true, runValidators: true });
    await followingAuthor.updateOne(
      { $pull: { follower: userId } },
      { new: true, runValidators: true }
    );
    return res.status(StatusCodes.OK).json({ message: 'Unfollowing succeed!' });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json(err);
  }
};

const userLogIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const data = { userId: user._id };
      const token = jwt.sign(data, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: process.env.JWT_EXPIRE_TIME,
      });
      const userInfo = {
        userId: user._id,
        userName: user.name,
        userRole: user.role,
        avatar: user.avatar,
      };
      return res.status(StatusCodes.OK).json({ token, userInfo });
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Wrong password, try again' });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const followersList = [];
    const followingsList = [];
    const followingPostsList = [];

    const [userAndFollower, userAndFollowing, userAndFollowingPost] = await Promise.all([
      User.findById(userId).populate('follower').exec(),
      User.findById(userId).populate('following').exec(),
      User.findById(userId).populate('followingPost').exec(),
    ]).then((result) => result);

    const follower =
      userAndFollower.follower.length > 4
        ? userAndFollower.follower
        : userAndFollower.follower.slice(0, 4);
    follower.forEach((eachFollower) => {
      const followerList = {};
      followerList.name = eachFollower.name;
      followerList.role = eachFollower.role;
      followerList.avatar = eachFollower.avatar;
      followerList.userId = eachFollower.userId;
      followersList.push(followerList);
    });

    const following =
      userAndFollowing.following.length > 4
        ? userAndFollowing.following
        : userAndFollowing.following.slice(0, 4);
    following.forEach((eachFollowing) => {
      const followingList = {};
      followingList.name = eachFollowing.name;
      followingList.role = eachFollowing.role;
      followingList.avatar = eachFollowing.avatar;
      followingList.userId = eachFollowing.userId;
      followingsList.push(followingList);
    });

    const followingPost =
      userAndFollowingPost.followingPost.length > 4
        ? userAndFollowingPost.followingPost
        : userAndFollowingPost.followingPost.slice(0, 4);
    followingPost.forEach((eachFollowingPost) => {
      const followingPostList = {};
      followingPostList.title = eachFollowingPost.title;
      followingPostList.postId = eachFollowingPost.postId;
      followingPostsList.push(followingPostList);
    });
    return res.status(StatusCodes.OK).json({
      userName: userAndFollower.name,
      userAvatar: userAndFollower.avatar,
      userRole: userAndFollower.role,
      userBgImg: userAndFollower.bgImg,
      followersList,
      followingsList,
      followingPostsList,
    });
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const verifyToken = async (req, res) => {
  const bearerHeader = req.headers.authorization;
  console.log(bearerHeader);
  if (!bearerHeader) return res.status(401).json({ message: 'no token is presented' });
  const bearer = bearerHeader.split(' ');
  const token = bearer[1];
  // verify() is a fake function, replace it with a real jwt function
  const userId = jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ message: 'invalid token' });
    }
    return payload.userId;
  });
  return res.status(StatusCodes.OK).json({ userId });
};

module.exports = {
  getUserById,
  createUser,
  getAllUsers,
  resetPassword,
  updateUser,
  patchUser,
  userLogIn,
  toggleFollowing,
  getUserProfile,
  verifyToken,
  emailResetPassword,
};
