const parentComment = require('../../models/homeModels/parentsCommentsModel');

// Gurdian Comment (post)
exports.gurdianComments = async (req, res) => {
  try {
    const { quote, name, gender, relation, email, phone, subject } = req.body;
    const newComment = new parentComment({
      quote,
      name,
      gender,
      relation,
      email,
      phone,
      subject,
    });
    await newComment.save();
    return res.success(201, 'আপনার মতামতটি সফলভাবে জমা হয়েছে।', newComment);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const customMessage = Object.values(error.errors)[0].message;
      return res.error(400, customMessage, null);
    }
    return res.error(500, error.message, null);
  }
};

// Approved Comments (Get)
exports.getApprovedComments = async (req, res) => {
  try {
    const comments = await parentComment
      .find({ status: 'approved' })
      .select('-status -email -phone -subject')
      .sort({ createdAt: -1 });
    if (!comments) {
      return res.error(404, 'Comments are not found', null);
    }

    return res.success(200, 'Comments fetched successfully', comments);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// All Comments for admin (Get)
exports.getAllCommentsForAdmin = async (req, res) => {
  try {
    const allComments = await parentComment.find().sort({ createdAt: -1 });
    if (!allComments) {
      return res.error(404, 'Comments are not found', null);
    }
    return res.success(200, 'All comments fetched successfully.', allComments);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// Update Comment Status
exports.updateCommentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const count = await parentComment.countDocuments({ status: 'approved' });
    if (count >= 10) {
      return res.error(400, 'Maximum 10 comments can be accepted.', null);
    }
    const updated = await parentComment.findByIdAndUpdate(
      id,
      {
        status: 'approved',
      },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.error(404, 'Comment not found');
    }

    return res.success(200, 'Comment accepted successfully.', updated);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// Comment Delete
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteData = await parentComment.findByIdAndDelete(id);

    if (!deleteData) {
      return res.error(404, 'Comment not found');
    }

    return res.success(200, 'Comment deleted successfully', deleteData);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};
