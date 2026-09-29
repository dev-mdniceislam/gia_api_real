const express = require('express');
const router = express.Router();
const isValidToken = require('../../middlewares/authMiddleware');

// all imports of controller
const {
  getContactInfo,
  pushContactInfo,
  deleteContactById,
} = require('../../controllers/ContactScreenController/contactScreenController');

// route
router.route('/').get(getContactInfo).post(isValidToken, pushContactInfo);
router.delete('/:id', isValidToken, deleteContactById);

module.exports = router;
