const heroSection = require('../../models/homeModels/heroSectionModel');
const deleteFiles = require('../../middlewares/fileDeleteMIddleware');

// Hero Section Data Get
exports.getHeroData = async (req, res) => {
  try {
    const heroData = await heroSection.findOne();
    if (!heroData) {
      return res.error(404, 'Hero section data not found');
    }
    return res.success(
      200,
      'Hero Section data fetched successfully.',
      heroData,
    );
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// Hero Section Data Update
exports.updateHeroData = async (req, res) => {
  try {
    const { subtitle } = req.body;
    const updatePayload = {};

    if (subtitle !== undefined) updatePayload.subtitle = subtitle.toString();

    if (req.files && req.files.length > 0) {
      const oldData = await heroSection.findOne();

      if (
        oldData &&
        oldData.slideImagePublicIds &&
        oldData.slideImagePublicIds.length > 0
      ) {
        for (const publicId of oldData.slideImagePublicIds) {
          await deleteFileFromCloudinary(publicId);
        }
      }

      // ২. নতুন ফাইলসমূহের Cloudinary URL এবং Public IDs সেভ করা
      updatePayload.slideImage = req.files.map((file) => file.path); // Cloudinary URL
      updatePayload.slideImagePublicIds = req.files.map(
        (file) => file.filename,
      ); // Cloudinary Public ID
    }

    const updatedHero = await heroSection.findOneAndUpdate({}, updatePayload, {
      new: true,
      runValidators: true,
      upsert: true,
    });

    return res.success(200, 'Hero Section updated successfully', updatedHero);
  } catch (error) {
    // কোনো এরর হলে ক্লাউডিনারিতে সদ্য আপলোড হওয়া নতুন ছবিগুলো মুছে ফেলা
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await deleteFileFromCloudinary(file.filename);
      }
    }
    return res.error(500, error.message, null);
  }
};

// Hero Section Data Delete
exports.deleteHeroData = async (req, res) => {
  try {
    const deleteData = await heroSection.findOneAndDelete({});
    if (!deleteData) {
      return res.error(404, 'No Hero Section data found to delete', null);
    }

    if (deleteData.slideImage && deleteData.slideImage.length > 0) {
      deleteFiles(deleteData.slideImage);
    }

    return res.success(200, 'Hero Section deleted successfully', null);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};
