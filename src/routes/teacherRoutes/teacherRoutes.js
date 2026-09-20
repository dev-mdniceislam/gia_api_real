const express = require('express');
const router = express.Router();
const { upload } = require('../../middlewares/multerMiddleware');
const isValidToken = require('../../middlewares/authMiddleware');

const {
  getGalleryDataAll,
  createCategory,
  getImagesByCategoryId,
  pushImagesToCategory,
  deleteCategory,
  deleteSingleImageFromCategory,
} = require('../../controllers/galleryController/galleryController');

// Base route: /api/v1/gallery
router
  .route('/')
  .get(getGalleryDataAll)
  .post(isValidToken, upload.array('images', 10), createCategory);

// Category route by ID: /api/v1/gallery/:id
router
  .route('/:id')
  .get(getImagesByCategoryId)
  .post(isValidToken, upload.array('images', 10), pushImagesToCategory)
  .delete(isValidToken, deleteCategory);

// Delete single image route: /api/v1/gallery/:id/delete-image
router.delete('/:id/delete-image', isValidToken, deleteSingleImageFromCategory);

module.exports = router;
