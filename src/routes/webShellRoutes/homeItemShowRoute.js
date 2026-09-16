const express = require('express');
const router = express.Router();

// Controller imports
const {
  getHomeItemShow,
  updateHomeItemShow,
} = require('../../controllers/webShellController/homeItemShowController');
const {
  getAboutShowItem,
  updateAboutShowItem,
} = require('../../controllers/webShellController/aboutItemShowController');

// Home Show Item Routes
router.route('/homeitemshow').get(getHomeItemShow).put(updateHomeItemShow);

// About Show Item Routes
router.route('/aboutitemshow').get(getAboutShowItem).put(updateAboutShowItem);

module.exports = router;
