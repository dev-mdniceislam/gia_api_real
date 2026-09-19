const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN
  console.log(token);

  if (!token) {
    return res.error(
      401,
      'Access denied. No token provided. Please login again',
      null,
    );
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_secret_key',
    );
    req.user = verified;
    next();
  } catch {
    return res.error(403, 'Invalid or expired token. Please login again', null);
  }
};

module.exports = verifyToken;
