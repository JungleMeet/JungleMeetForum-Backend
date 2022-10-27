const { StatusCodes } = require('http-status-codes');
const { difference } = require('lodash');
const Notification = require('../models/Notification');

const getUnreadNotifications = async (req, res) => {
  try {
    const { userId } = req;
    const notifications = await Notification.find({ notifiedUserId: userId, viewed: false })
      .populate({ path: 'triggerUserId', select: 'name' })
      .populate({ path: 'targetPostId', select: 'title' })
      .exec();
    res.status(StatusCodes.OK).json(notifications);
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).json(e);
  }
};

const readNotifications = async (req, res) => {
  try {
    const { userId } = req;
    const { notificationIds } = req.body;

    // verify if all notifications are for the requesting user
    const notifications = await Notification.find({ _id: { $in: notificationIds } }).exec();
    const notifiedUsers = notifications.map(({ notifiedUserId }) => notifiedUserId.toString());
    // the difference function will return an array of different elements
    // the notifiedUsers should all be the requesting userId, therefore the length should be 0
    if (difference(notifiedUsers, [userId]).length > 0) {
      return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    await Notification.updateMany({ _id: { $in: notificationIds } }, { viewed: true });
    return res.sendStatus(StatusCodes.OK);
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).json(e);
  }
};

module.exports = { getUnreadNotifications, readNotifications };
