const express = require('express');
const router = express.Router();
const isValidToken = require('../../middlewares/authMiddleware');

const {
  createNotice,
  getAllNotice,
  deleteNotice,
  deleteAllNotice,
} = require('../../controllers/noticeController/noticeController');

//----------------> Notice CRUD <-------------------
router
  .route('/')
  .get(getAllNotice)
  .post(isValidToken, createNotice)
  .delete(isValidToken, deleteAllNotice);
router.route('/:id').delete(isValidToken, deleteNotice);

module.exports = router;
