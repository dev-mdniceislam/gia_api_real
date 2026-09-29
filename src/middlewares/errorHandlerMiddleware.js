const multer = require('multer');

// Express Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.error(400, 'File size is too large! Maximum limit is 5MB.');
    }
    return res.error(400, err.message);
  }

  if (err.name === 'ValidationError') {
    const customMessage = Object.values(err.errors)[0].message;
    return res.error(400, customMessage);
  }

  return res.error(500, err.message || 'Internal Server Error');
};

module.exports = errorHandler;
