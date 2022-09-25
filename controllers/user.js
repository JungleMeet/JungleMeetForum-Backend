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
  patchUser,
};
