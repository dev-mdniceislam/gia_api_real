const express = require('express');
const router = express.Router();
const { upload } = require('../../middlewares/multerMiddleware');
const isValidToken = require('../../middlewares/authMiddleware');

// all controller imports here
const {
  getAllTeachers,
  createTeacher,
  getTeacherById,
  updateTeacherInfoById,
  deleteTeacherById,
} = require('../../controllers/teacherController/teacherController');

// upload middleware

router
  .route('/')
  .get(getAllTeachers)
  .post(isValidToken, upload.single('image'), createTeacher);
router
  .route('/:id')
  .get(getTeacherById)
  .put(isValidToken, upload.single('image'), updateTeacherInfoById)
  .delete(isValidToken, deleteTeacherById);

// route export
module.exports = router;
