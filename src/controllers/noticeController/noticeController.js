const Notice = require('../../models/noticeModels/noticeModel');

// Get all notices (sorted newest first)
exports.getAllNotice = async (req, res) => {
  try {
    const result = await Notice.find().sort({ createdAt: -1 });

    if (!result || result.length === 0) {
      return res.error(404, 'No notices found', []);
    }

    return res.success(200, 'Notices fetched successfully', result);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// Create a new notice
exports.createNotice = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.error(400, 'Request body cannot be empty', null);
    }

    const notice = await Notice.create(req.body);
    return res.success(201, 'Notice created successfully', notice);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// Delete single notice by ID
exports.deleteNotice = async (req, res) => {
  try {
    const deletedNotice = await Notice.findByIdAndDelete(req.params.id);

    if (!deletedNotice) {
      return res.error(404, 'Notice not found', null);
    }

    return res.success(200, 'Notice deleted successfully', deletedNotice);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// Delete all notices
exports.deleteAllNotice = async (req, res) => {
  try {
    const result = await Notice.deleteMany({});
    return res.success(
      200,
      `${result.deletedCount} notices deleted successfully`,
      [],
    );
  } catch (error) {
    return res.error(500, error.message, null);
  }
};
