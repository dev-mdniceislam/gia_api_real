const express = require('express');
const { upload } = require('../../middlewares/multerMiddleware');
const router = express.Router();
const isValidToken = require('../../middlewares/authMiddleware');

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

const {
  sscStudentGetAll,
  getSSCStudentsById,
  createSSCStudent,
  updateSSCStudent,
  deleteSSCStudent,
} = require('../../controllers/homeController/SSCPassedStudentController');

//-------------------> Hero Section Multer & CRUD <-------------------------

router
  .route('/herosection')
  .get(getHeroData)
  .delete(isValidToken, deleteHeroData)
  .put(isValidToken, upload.array('slideImage', 4), updateHeroData);

// -------------------------> Parent Comments Routes <-------------------------
router
  .route('/parentComment')
  .get(getApprovedComments)
  .post(isValidToken, gurdianComments);
router
  .route('/parentComment/:id')
  .patch(isValidToken, updateCommentStatus)
  .delete(isValidToken, deleteComment);
router.get('/parentCommentAdmin', isValidToken, getAllCommentsForAdmin);

// -------------------------> SSC passed student Routes  <-------------------------
router
  .route('/candidates')
  .get(sscStudentGetAll)
  .post(isValidToken, upload.single('image'), createSSCStudent);
router
  .route('/candidates/:id')
  .get(getSSCStudentsById)
  .put(isValidToken, upload.single('image'), updateSSCStudent)
  .delete(isValidToken, deleteSSCStudent);

module.exports = router;
