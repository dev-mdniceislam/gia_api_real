const emergencyNotice = require('../../models/webshellModels/emergencyNoticeModel');
const deleteFile = require('../../middlewares/fileDeleteMIddleware');

exports.getEmergencyNotice = async (req, res) => {
  try {
    const notice = await emergencyNotice.findOne();

    if (!notice) {
      return res.error(404, 'Emergency notice not found', null);
    }

    return res.success(200, 'Emergency notice fetched successfully', notice);
  } catch {
    return res.error(500, 'Notice fetch failed');
  }
};

exports.createAndUpdateNotice = async (req, res) => {
  try {
    const { badgeText, bodyText } = req.body;

    // 1. Validation for required text fields
    if (!badgeText || !bodyText) {
      if (req.file) {
        await deleteFile(req.file.filename);
      }
      return res.error(400, 'BadgeText and BodyText are required.');
    }

    // 2. Fetch existing notice to handle image replacement/cleanup
    const existingNotice = await emergencyNotice.findOne();

    // Prepare update object
    const updateData = {
      badgeText,
      bodyText,
    };

    // If a new image was uploaded, assign path AND public ID/filename
    if (req.file) {
      updateData.dialogueImage = req.file.path;
      updateData.imagePublicId = req.file.filename;

      // Delete the previous file if it exists
      if (existingNotice && existingNotice.imagePublicId) {
        await deleteFile(existingNotice.imagePublicId);
      }
    }

    // 3. Upsert document in MongoDB
    const updated = await emergencyNotice.findOneAndUpdate({}, updateData, {
      returnDocument: 'after',
      upsert: true,
      runValidators: true,
    });

    if (!updated) {
      if (req.file) {
        await deleteFile(req.file.filename);
      }
      return res.error(400, 'Failed to save notice.');
    }

    return res.success(200, 'Notice updated successfully.', updated);
  } catch (error) {
    if (req.file) {
      await deleteFile(req.file.filename);
    }
    return res.error(500, 'Notice creation or update failed.', error.message);
  }
};

exports.deleteEmergencyNotice = async (req, res) => {
  try {
    // 1. Find the existing notice
    const notice = await emergencyNotice.findOne();
    if (!notice) {
      return res.error(404, 'Notice not found to delete', {});
    }

    // 2. Delete the associated image file from storage if it exists
    if (notice.imagePublicId) {
      await deleteFile(notice.imagePublicId);
    }

    // 3. Delete the document from MongoDB
    await emergencyNotice.findByIdAndDelete(notice.id);

    return res.success(200, 'Emergency notice deleted successfully', {});
  } catch (error) {
    return res.error(500, 'Notice delete failed', error.message);
  }
};
