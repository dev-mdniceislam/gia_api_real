const express = require('express');
const router = express.Router();
const isValidToken = require('../../middlewares/authMiddleware');
const { upload } = require('../../middlewares/multerMiddleware');

// all controller imports
const {
  getAboutSchool,
  createOrUpdateSchoolDetails,
  createOrUpdateSchoolGoals,
} = require('../../controllers/aboutSectionControllers/schoolDetailsController');

// routes
router.route('/').get(getAboutSchool);
router
  .route('/details')
  .put(isValidToken, upload.single('image'), createOrUpdateSchoolDetails);

router.route('/goals').put(isValidToken, createOrUpdateSchoolGoals);

// export route
module.exports = router;
