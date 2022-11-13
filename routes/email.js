const { Router } = require('express');

const sendEmail = require('../services/sendEmail');

const emailRouter = Router();
emailRouter.post('/sendEmail', sendEmail);

module.exports = emailRouter;
