const { cloudinary } = require('./multerMiddleware');

const deleteFileFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

module.exports = deleteFileFromCloudinary;
