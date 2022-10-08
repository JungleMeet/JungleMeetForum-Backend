const User = require('../models/User');

const adminGuard = async (req, res, next) => {
  const user = await User.findById(req.userId).exec();
  if (user.role !== 'admin') return res.sendStatus(403);
  return next();
};

module.exports = adminGuard;
