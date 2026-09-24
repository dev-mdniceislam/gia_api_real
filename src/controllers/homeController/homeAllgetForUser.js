const heroSection = require('../../models/homeModels/heroSectionModel');
const {
  SSCPassedStudentFormat,
} = require('../../models/homeModels/SSCPassedStudentModel');
const Notice = require('../../models/noticeModels/noticeModel');
const parentComments = require('../../models/homeModels/parentsCommentsModel');
const galleryData = require('../../models/gallerySectionModels/galleryModel');

exports.getAllDataForHome = async (req, res) => {
  try {
    const [heroData, candidates, notices, gallery, comments] =
      await Promise.all([
        heroSection.findOne(),
        SSCPassedStudentFormat.findOne().populate({
          path: 'candidates',
          options: { sort: { gpa: -1 } },
        }),
        Notice.find().sort({ createdAt: -1 }).limit(5),
        galleryData
          .find(
            {},
            { category: 1, images: { $slice: 10 }, createdAt: 1, updatedAt: 1 },
          )
          .limit(5),
        parentComments
          .find({ status: 'approved' })
          .select('-status')
          .sort({ createdAt: -1 }),
      ]);

    const data = {
      heroData: heroData || null,
      candidates: candidates || null,
      notices: notices || [],
      gallery: gallery || [],
      comments: comments || [],
    };

    return res.success(200, 'Home page data fetched successfully', data);
  } catch (error) {
    return res.error(500, error.message || 'Home fetch failed', null);
  }
};
