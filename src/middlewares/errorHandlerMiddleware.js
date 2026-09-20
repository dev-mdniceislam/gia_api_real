// Express Error Handling Middleware-এ
const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.error(400, 'File size is too large! Maximum limit is 5MB.');
    }
  }
  return res.error(500, err.message);
};

module.exports = errorHandler;
