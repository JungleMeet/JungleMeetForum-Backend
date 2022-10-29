const { Router } = require('express');
const auth = require('../middleware/auth');
const { getNotifications, readNotifications } = require('../controllers/notification');

const notificationRouter = Router();
notificationRouter.use(auth);

notificationRouter.get('/', getNotifications);
notificationRouter.put('/', readNotifications);

module.exports = notificationRouter;
