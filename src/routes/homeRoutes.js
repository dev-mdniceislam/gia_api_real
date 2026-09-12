const express = require('express');

// Router scaffolding
const router = express.Router();

//controller route imports
const {
  createNotice,
  getAllNotice,
  deleteNotice,
} = require('../controllers/homeController/noticeController');

// Noce CRUD
router.route('/notice').get(getAllNotice).post(createNotice);

//delete notice
router.route('/notice/:id').delete(deleteNotice);

module.exports = router;
