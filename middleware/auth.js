const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { cookie } = req.headers;
  console.log(req.headers);
  const token = cookie.split('=')[1];

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
