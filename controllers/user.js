const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    return res.status(StatusCodes.OK).json(user);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const createUser = async (req, res) => {
  const { name, password, email, avatar, bgImg } = req.body;

  try {
    const now = new Date();
    const user = new User({ name, password, email, avatar, bgImg, createTime: now });
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
  const { id, newPassword, oldPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (user.password === oldPassword) {
      user.update({ $set: { password: newPassword } }, { runValidators: true }).save();
    }
    return res.status(StatusCodes.OK).json(user);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, avatar, bgImg } = req.body;

  try {
    const oldUser = await User.findById(id);
    await User.updateOne(
      { _id: id },
      {
        _id: id,
        name: name || oldUser.name,
        email: email || oldUser.email,
        avatar: avatar || oldUser.avatar,
        bgImg: bgImg || oldUser.bgImg,
      },
      { runValidators: true }
    );
    const newUser = await User.findById(id);

    return res.status(StatusCodes.OK).json(newUser);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

const patchUser = async (req, res) => {
  const { id } = req.params;
  const { userName, password, email, avatar, bgImg } = req.body;
  const modifiedUser = { userName, password, email, avatar, bgImg };

  User.findOneAndUpdate(
    { _id: id },
    modifiedUser,
    { runValidator: true, useFindAndModify: false, new: true },
    (err, result) => {
      if (err) {
        return res.status(StatusCodes.NOT_FOUND).json(err);
      }
      return res.status(StatusCodes.OK).json(result);
    }
  );
};

module.exports = {
  getUserById,
  createUser,
  getAllUsers,
  resetPassword,
  updateUser,
  patchUser,
};
