const { Router } = require('express');
const auth = require('../middleware/auth');
const {
  getNotifications,
  readNotifications,
  readSingleNotifications,
} = require('../controllers/notification');

const notificationRouter = Router();
notificationRouter.use(auth);

notificationRouter.get('/', getNotifications);
notificationRouter.put('/', readNotifications);
notificationRouter.patch('/', readSingleNotifications);

module.exports = notificationRouter;
