const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  const bearer = bearerHeader.split(' ');
  const token = bearer[1];
  if (!token) return res.status(401).json({ message: 'no token is presented' });
  // verify() is a fake function, replace it with a real jwt function
  req.userId = jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ message: 'invalid token' });
    }
    return payload.userId;
  });
  return next();
};
module.exports = auth;
