// this is a fake function to verify token.
// later when you have learnt jwt, you use a real function to verify real token
const verify = (token) => token;

const auth = (req, res, next) => {
  console.log(req.headers);
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'no token is presented' });
  // verify() is a fake function, replace it with a real jwt function
  const payload = verify(token);
  if (!payload) return res.status(401).json({ message: 'invalid token' });
  req.userId = payload;
  return next();
};

module.exports = auth;
