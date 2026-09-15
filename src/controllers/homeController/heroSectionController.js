const heroSection = require('../../models/homeModels/heroSectionModel');
const deleteFiles = require('../../utils/fileDeleteMIddleware');

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

// Hero Section Data Create
exports.createHeroData = async (req, res) => {
  try {
    const heroData = await heroSection.findOne();
    if (heroData) {
      return res.error(400, 'Data already exists.', null);
    }

    const { subtitle } = req.body || {};

    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map((file) => file.filename);
    }

    const newHero = new heroSection({
      subtitle: subtitle || '',
      slideImage: imagePaths,
    });

    await newHero.save();
    return res.success(201, 'Hero section data added successfully', newHero);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// Hero Section Data Update
exports.updateHeroData = async (req, res) => {
  try {
    const { subtitle } = req.body;
    const updatePayload = {};

    if (subtitle) updatePayload.subtitle = subtitle;

    if (req.files && req.files.length > 0) {
      const oldData = await heroSection.findOne();
      if (oldData && oldData.slideImage) {
        deleteFiles(oldData.slideImage);
      }
      updatePayload.slideImage = req.files.map((file) => file.filename);
    }

    const newHeroUpdate = await heroSection.findOneAndUpdate(
      {},
      updatePayload,
      { new: true, runValidators: true },
    );

    if (!newHeroUpdate) {
      return res.error(404, 'Hero data not found to update');
    }

    return res.success(200, 'Hero Section updated successfully', newHeroUpdate);
  } catch (error) {
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
