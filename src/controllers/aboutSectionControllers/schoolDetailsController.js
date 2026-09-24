const schoolDetails = require('../../models/AboutSectionModels/schoolDetailsModel');
const schoolGoals = require('../../models/AboutSectionModels/schoolGoals');
const deleteFile = require('../../middlewares/fileDeleteMiddleware');

// get about school data
exports.getAboutSchool = async (req, res) => {
  try {
    const goalsData = await schoolGoals.find();
    const schoolDetailsData = await schoolDetails.find();

    const data = {
      ...goalsData,
      schoolDetails: schoolDetailsData,
    };
    return res.success(200, 'School About data fetch successfully', data);
  } catch {
    return res.error(500, 'School about data fetched failed');
  }
};

// create or update school details
exports.createOrUpdateSchoolDetails = async (req, res) => {
  try {
    const { description } = req.body;
    const existingDetails = await schoolDetails.findOne();

    if (!existingDetails && (!req.file || !description)) {
      if (req.file) {
        await deleteFile(req.file.filename);
      }
      return res.error(
        400,
        'Description and image are required to create school details',
      );
    }

    let imageData = {};

    if (req.file) {
      const image = req.file.path;
      const publicId = req.file.filename;

      if (existingDetails && existingDetails.imagePublicId) {
        await deleteFile(existingDetails.imagePublicId);
      }

      imageData = { image: image, imagePublicId: publicId };
    }

    const updateData = {
      ...(description && { description }),
      ...imageData,
    };

    const updatedSchoolDetails = await schoolDetails.findOneAndUpdate(
      {},
      updateData,
      { returnDocument: 'after', upsert: true, runValidators: true },
    );

    return res.success(
      200,
      existingDetails
        ? 'School details updated successfully'
        : 'School details created successfully',
      updatedSchoolDetails,
    );
  } catch (error) {
    if (req.file) {
      await deleteFile(req.file.filename);
    }
    return res.error(500, 'School details process failed');
  }
};

exports.createOrUpdateSchoolGoals = async (req, res) => {
  try {
    const { goals, feature, commitment } = req.body;

    const existingGoals = await schoolGoals.findOne();

    const updateData = {
      ...(Array.isArray(goals) && { goals }),
      ...(Array.isArray(feature) && { feature }),
      ...(Array.isArray(commitment) && { commitment }),
    };

    const updatedGoals = await schoolGoals.findOneAndUpdate({}, updateData, {
      returnDocument: 'after',
      upsert: true,
      runValidators: true,
    });

    return res.success(
      200,
      existingGoals
        ? 'School goals updated successfully'
        : 'School goals created successfully',
      updatedGoals,
    );
  } catch (error) {
    return res.error(
      500,
      'Data creation or update failed. Please try again',
      error.message,
    );
  }
};
