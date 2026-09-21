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
  createSSCBatch,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  deleteSSCBatch,
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

// -----------------------------------------------> SSC passed student Routes  <-------------------------
router.route('/batch').get(sscStudentGetAll).post(isValidToken, createSSCBatch);

// 2. Get batch by ID & Delete entire batch
router.route('/batch/:id').delete(isValidToken, deleteSSCBatch);

// 3. Add a new candidate to a specific batch (Image upload সহ)
router
  .route('/batch/candidate')
  .post(isValidToken, upload.single('image'), addCandidate);

// 4. Update or Delete a specific candidate inside a batch
router
  .route('/batch/candidate/:candidateId')
  .put(isValidToken, upload.single('image'), updateCandidate)
  .delete(isValidToken, deleteCandidate);

module.exports = router;
