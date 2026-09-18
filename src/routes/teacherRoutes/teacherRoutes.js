const express = require('express');
const router = express.Router();
const uploadFile = require('../../middlewares/multerMiddleware');

// all controller imports here
const {
  getAllTeachers,
  createTeacher,
  getTeacherById,
  updateTeacherInfoById,
  deleteTeacherById,
} = require('../../controllers/teacherController/teacherController');

// upload middleware
const upload = uploadFile({
  isNamedDate: true,
  maxSizeMB: 5,
});
router
  .route('/')
  .get(getAllTeachers)
  .post(upload.single('image'), createTeacher);
router
  .route('/:id')
  .get(getTeacherById)
  .put(upload.single('image'), updateTeacherInfoById)
  .delete(deleteTeacherById);

// route export
module.exports = router;
