const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    const { password, ...others } = user._doc;

    return res.status(StatusCodes.OK).json(others);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

module.exports = {
  getUserById,
};
