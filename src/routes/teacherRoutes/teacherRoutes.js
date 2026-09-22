const express = require('express');
const router = express.Router();
const { upload } = require('../../middlewares/multerMiddleware');
const isValidToken = require('../../middlewares/authMiddleware');

const {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacherInfoById,
  deleteTeacherById,
} = require('../../controllers/teacherController/teacherController');

// Base route: /api/v1/gallery
router
  .route('/')
  .get(getAllTeachers)
  .post(isValidToken, upload.single('image'), createTeacher);

// Category route by ID: /api/v1/gallery/:id
router
  .route('/:id')
  .get(getTeacherById)
  .put(isValidToken, upload.single('image'), updateTeacherInfoById)
  .delete(isValidToken, deleteTeacherById);

module.exports = router;
