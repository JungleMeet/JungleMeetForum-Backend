const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - password
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: The Auto-generated id of a post
 *         name:
 *           type: string
 *           description: name of the user
 *         password:
 *           type: string
 *           description: password of the user
 *         email:
 *           type: string
 *           description: email of the user
 *         avatar:
 *           type: string
 *           description: avatar of the user
 *         createdTime:
 *           type: string
 *           description: the time of creating the user
 *         bgImg:
 *           type: string
 *           description: background image of the user profile
 *         role:
 *           type: string
 *           description: role of the user
 *         follower:
 *           type: array
 *           items:
 *             type: string
 *           description: follower of the user
 *         following:
 *           type: array
 *           items:
 *             type: string
 *           description: the following user of the user
 *         followingPost:
 *           type: array
 *           items:
 *             type: string
 *           description: followingPost of the user
 *       example:
 *         _id: 6332d81195b55eda2a612059
 *         name: Rachel
 *         password: abcd1234
 *         email: example@example.com
 *         avatar: xxxxx
 *         createTime: 2022-09-27T11:01:37.487Z
 *         bgImg: xxxxx
 *         role: admin
 *         follower: [6332d81195b55eda2a612058, 6332d81195b55eda2a612057]
 *         following: [6332d81195b55eda2a612053, 6332d81195b55eda2a612052]
 *         followingPost: [6332d81195b55eda2a612153, 6332d81195b55eda2a612058, 6332d81195b55eda2a602057]
 *
 * paths:
 *   /users/{id}:
 *     get:
 *       tags:
 *         - user
 *       summary: Find user by id
 *       description: Return a single user
 *       operationId: getUserById
 *       parameters:
 *         - name: id
 *           in: path
 *           description: ID of user to return
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '404':
 *           description: User not found
 *   /users:
 *     post:
 *       tags:
 *         - user
 *       summary: Add a new user
 *       description: Return created user
 *       operationId: createUser
 *       requestBody:
 *         description:
 *           Add a new user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User{name, password, email, avatar, bgImg}'
 *       responses:
 *         '200':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '404':
 *           description: Not found
 */
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
    const user = new User({ name, password, email, avatar, bgImg, createdTime: now });
    const ret = await user.save();

    return res.status(StatusCodes.OK).json(ret);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json(err);
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
      await user.updateOne({ $set: { password: newPassword } }, { new: true, runValidators: true });
      return res.status(StatusCodes.OK).send('Password changed successfully!');
    }
    return res.status(StatusCodes.UNAUTHORIZED).send('Wrong password, try again');
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send('Password should be 6 characters at least, try again');
    }
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
        email: email || oldUser.name,
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
  const { name, password, email, avatar, bgImg } = req.body;
  const modifiedUser = { name, password, email, avatar, bgImg };
  try {
    const user = await User.findByIdAndUpdate({ _id: id }, modifiedUser, {
      runValidator: true,
      new: true,
      returnOriginal: false,
    });
    await user.save();
    return res.status(StatusCodes.OK).json(user);
  } catch (err) {
    return res.status(StatusCodes.NOT_FOUND).json(err);
  }
};

module.exports = {
  getUserById,
  createUser,
  getAllUsers,
  resetPassword,
  updateUser,
  patchUser,
};
