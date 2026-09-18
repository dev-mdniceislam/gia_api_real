// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

//   if (!token) {
//     return res.error(401, 'Access denied. No token provided.', null);
//   }

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
//     req.user = verified;
//     next(); // টোকেন সঠিক হলে পরবর্তী কন্ট্রোলারে যাবে
//   } catch (error) {
//     return res.error(403, 'Invalid or expired token.', null);
//   }
// };

// module.exports = verifyToken;
