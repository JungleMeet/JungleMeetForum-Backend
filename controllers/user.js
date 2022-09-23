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

// patch user
// update database and respond to user
const patchUser = async (req, res) => {
  // get id by params
  const { id } = req.params;
  // get data from request body
  const { userName, password, email, avatar, bgImg } = req.body;
  const userUpCon = { userName, password, email, avatar, bgImg };

  // find id by params and update database from request body
  User.findOneAndUpdate(
    { _id: id },
    userUpCon,
    { runValidator: true, useFindAndModify: false, new: true },
    (err, result) => {
      // error handling
      if (err) {
        return res.status(StatusCodes.NOT_FOUND).json(err);
      }
      // respond to user
      return res.status(StatusCodes.OK).json(result);
    }
  );
};

module.exports = {
  getUserById,
  createUser,
  patchUser,
};
