const Notice = require('../../models/noticeModels/noticeModel');

//notice all get
exports.getAllNotice = async (req, res) => {
  try {
    const result = await Notice.find();
    res.success(200, 'Notice fetched successfully', result);
  } catch (error) {
    res.error(500, error.message, null);
  }
};

exports.createNotice = async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.success(201, 'Notice created successfully', notice);
  } catch (error) {
    res.error(500, error.message, null);
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const isDelete = await Notice.findByIdAndDelete(req.params.id);
    if (!isDelete) {
      res.error(404, 'Notice not found', null);
    }

    res.success(200, 'Notice deleted successfully', isDelete);
  } catch (error) {
    res.error(500, error.message, null);
  }
};

exports.deleteAllNotice = async (req, res) => {
  try {
    const result = await Notice.deleteMany({});

    res.success(200, 'All notices deleted successfully', []);
  } catch (error) {
    res.error(500, error.message, null);
  }
};
