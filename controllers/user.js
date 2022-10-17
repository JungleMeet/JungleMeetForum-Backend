const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
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
 *           example: 6332d81195b55eda2a612059
 *         name:
 *           type: string
 *           description: name of the user
 *           example: Rachel
 *         password:
 *           type: string
 *           description: password of the user
 *           example: abcd1234
 *         email:
 *           type: string
 *           description: email of the user
 *           example: example@example.com
 *         avatar:
 *           type: string
 *           description: avatar of the user
 *           example: xxxxx
 *         createdTime:
 *           type: string
 *           description: the time of creating the user
 *           example: 2022-09-27T11:01:37.487Z
 *         bgImg:
 *           type: string
 *           description: background image of the user profile
 *           example: xxxxx
 *         role:
 *           type: string
 *           description: role of the user
 *           example: admin
 *         follower:
 *           type: array
 *           items:
 *             type: string
 *           description: follower of the user
 *           example: [6332d81195b55eda2a612058, 6332d81195b55eda2a612057]
 *         following:
 *           type: array
 *           items:
 *             type: string
 *           description: the following user of the user
 *           example: [6332d81195b55eda2a612053, 6332d81195b55eda2a612052]
 *         followingPost:
 *           type: array
 *           items:
 *             type: string
 *           description: followingPost of the user
 *           example: [6332d81195b55eda2a612153, 6332d81195b55eda2a612058, 6332d81195b55eda2a602057]
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
 *               type: object
 *               required:
 *                 - name
 *                 - password
 *                 - email
 *               properties:
 *                 name:
 *                   type: string
 *                   description: name of the user
 *                   example: Rachel
 *                 password:
 *                   type: string
 *                   description: password of the user
 *                   example: abcd1234
 *                 email:
 *                   type: string
 *                   description: email of the user
 *                   example: example@example.com
 *                 avatar:
 *                   type: string
 *                   description: avatar of the user
 *                   example: xxxxx
 *                 bgImg:
 *                   type: string
 *                   description: background image of the user profile
 *                   example: xxxxx
 *       responses:
 *         '200':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '400':
 *           description: Bad request
 *   /users/login:
 *      post:
 *        tags:
 *          - user
 *        summary: User Log in and set cookie
 *        discription: Set cookie to user broswer
 *        operationId: userLogIn
 *        requestBody:
 *          description:
 *            User log in
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                required:
 *                  - email
 *                  - password
 *                properties:
 *                   password:
 *                     type: string
 *                     description: password of the user
 *                     example: abcd1234
 *                   email:
 *                     type: string
 *                     description: email of the user
 *                     example: example@example.com
 *        responses:
  *         '200':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: 'Successfully logged in'
 *         '401':
 *           description: login failed
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: 'Wrong password, try again'
 *
 *         '404':
 *           description: Bad request
 *   /users/{userId}:
 *     patch:
 *       tags:
 *         - user
 *       summary: patch user by id
 *       description: patch user information
 *       operationId: patchUser
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: userId
 *           in: path
 *           description: the id of user
 *           schema:
 *             type: string
 *       requestBody:
 *         description:
 *           patch user by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *               properties:
 *                 name:
 *                   type: string
 *                   description: user's name
 *                   example: Rachel
 *                 email:
 *                   type: string
 *                   description: email of the user
 *                   example: example@example.com
 *                 avatar:
 *                   type: string
 *                   description: avatar of the user
 *                   example: xxxxx
 *                 bgImg:
 *                   type: string
 *                   description: background image of the user profile
 *                   example: xxxxx
 *       responses:
 *         '200':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         '404':
 *           description: not found
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
    if (err.code === 11000) {
      if (Object.keys(err.keyValue).includes('name')) {
        return res.status(StatusCodes.CONFLICT).json({ message: 'Name existed' });
      }
      if (Object.keys(err.keyValue).includes('email')) {
        return res.status(StatusCodes.CONFLICT).json({ message: 'Email registered' });
      }
    }
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
    if (user.password === password) {
      const data = { userId: user._id };
      const token = jwt.sign(data, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: process.env.JWT_EXPIRE_TIME,
      });
      res.cookie('token', token);
      console.log(token);
      return res.status(StatusCodes.OK).json({ message: 'Successfully logged in' });
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Wrong password, try again' });
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
  userLogIn,
  toggleFollowing,
};
