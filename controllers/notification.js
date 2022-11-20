const { StatusCodes } = require('http-status-codes');
const { difference, isEmpty } = require('lodash');
const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const { userId } = req;
    const { pageNumber, limit } = req.query;

    // const paginationCondition = lastNotificationId ? { _id: { $lt: lastNotificationId } } : {};
    const length = await Notification.count({ notifiedUserId: userId });
    const lengthOfUnread = await Notification.count({ notifiedUserId: userId, viewed: false });
    const notifications = await Notification.find({ notifiedUserId: userId })
      .sort({ viewed: 1, createdAt: -1 })
      .skip(pageNumber > 0 ? pageNumber * limit : 0)
      .limit(limit || 5)
      .populate({ path: 'triggerUserId', select: 'name avatar' })
      .populate({ path: 'targetPostId', select: 'title' })
      .exec();
    res.status(StatusCodes.OK).json({ length, lengthOfUnread, notifications });
  } catch (e) {
    console.log(e);
    res.status(StatusCodes.BAD_REQUEST).json(e);
  }
};

const readNotifications = async (req, res) => {
  try {
    const { userId } = req;
    const { notificationIds } = req.body;

    // verify if all notifications are for the requesting user
    const notifications = await Notification.find({ _id: { $in: notificationIds } }).exec();
    if (isEmpty(notifications)) return res.sendStatus(StatusCodes.NOT_FOUND);
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

const readSingleNotifications = async (req, res) => {
  const { userId } = req;
  const { notificationId } = req.body;
  try {
    const notification = await Notification.findOne({ _id: notificationId });
    if (notification) {
      if (userId === notification.notifiedUserId.toString()) {
        console.log('yes');
        notification.viewed = true;
        await notification.save();
        return res.sendStatus(StatusCodes.OK);
      }
    }
    return res.sendStatus(StatusCodes.NOT_FOUND);
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.BAD_REQUEST).json(e);
  }
};

module.exports = { getNotifications, readNotifications, readSingleNotifications };
