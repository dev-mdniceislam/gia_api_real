const express = require('express');
const multer = require('multer');
const uploadFile = require('../../middlewares/multerMiddleware');
const path = require('path');

const router = express.Router();

const {
  createNotice,
  getAllNotice,
  deleteNotice,
} = require('../../controllers/homeController/noticeController');
const {
  getHeroData,
  updateHeroData,
  deleteHeroData,
} = require('../../controllers/homeController/heroSectionController');
const {
  gurdianComments,
  getAllCommentsForAdmin,
  getApprovedComments,
  updateCommentStatus,
  deleteComment,
} = require('../../controllers/homeController/parentsCommentController');

//----------------> Notice CRUD <-------------------
router.route('/notice').get(getAllNotice).post(createNotice);
router.route('/notice/:id').delete(deleteNotice);

//-------------------> Hero Section Multer & CRUD <-------------------------
const upload = uploadFile({
  isNamedDate: true,
  maxSizeMB: 5,
});

router
  .route('/herosection')
  .get(getHeroData)
  .delete(deleteHeroData)
  .put(upload.array('slideImage', 4), updateHeroData);

// -------------------------> Parent Comments Routes <-------------------------
router
  .route('/parentCommentUser')
  .get(getApprovedComments)
  .post(gurdianComments);
router
  .route('/parentCommentAdmin/:id')
  .patch(updateCommentStatus)
  .delete(deleteComment);
router.get('/parentCommentAdmin', getAllCommentsForAdmin);

module.exports = router;
