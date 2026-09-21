const express = require('express');
const router = express.Router();
const isValidToken = require('../../middlewares/authMiddleware');
const { upload } = require('../../middlewares/multerMiddleware');
// Controller imports

// home item show
const {
  getHomeItemShow,
  updateHomeItemShow,
} = require('../../controllers/webShellController/homeItemShowController');

// about section item show
const {
  getAboutShowItem,
  updateAboutShowItem,
} = require('../../controllers/webShellController/aboutItemShowController');

// webshell other data
const {
  getEmergencyNotice,
  createAndUpdateNotice,
  deleteEmergencyNotice,
} = require('../../controllers/webShellController/emergencyNoticeController');

// Social Link Controller
const {
  getSocialLinks,
  createAndUpdateSocialLinks,
  deleteSocialLinks,
} = require('../../controllers/webShellController/socialLinkController');

//-------------------------> Home Show Item Routes <---------------------------
router
  .route('/homeitemshow')
  .get(getHomeItemShow)
  .put(isValidToken, updateHomeItemShow);

//-------------------------> About Show Item Routes <---------------------------
router
  .route('/aboutitemshow')
  .get(getAboutShowItem)
  .put(isValidToken, updateAboutShowItem);

//-------------------------> Emergency Notice data <---------------------------
router
  .route('/emergencyNotice')
  .get(getEmergencyNotice)
  .put(isValidToken, upload.single('image'), createAndUpdateNotice)
  .delete(isValidToken, deleteEmergencyNotice);

//-------------------------> Social Link Routes <---------------------------
router
  .route('/sociallink')
  .get(getSocialLinks)
  .put(isValidToken, createAndUpdateSocialLinks);

module.exports = router;
