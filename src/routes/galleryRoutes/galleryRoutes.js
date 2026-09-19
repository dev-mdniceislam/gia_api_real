const express = require('express');
const router = express.Router();
const { upload } = require('../../middlewares/multerMiddleware');
const isValidToken = require('../../middlewares/authMiddleware');

// Controller imports
const {
  getGalleryDataAll,
  createCategory,
  getImagesByCategoryId,
  pushImagesToCategory,
  deleteCategory,
  deleteSingleImageFromCategory,
} = require('../../controllers/galleryController/galleryController');

// Base route: / (e.g., /api/gallery)
router
  .route('/')
  .get(getGalleryDataAll)
  .post(isValidToken, upload.array('images', 10), createCategory);

// Category route by ID: /:categoryId
router
  .route('/:id')
  .get(getImagesByCategoryId)
  .post(isValidToken, upload.array('images'), pushImagesToCategory)
  .delete(isValidToken, deleteCategory);

// Single image route: /:categoryId/images/:imageId
router.put('/:id', isValidToken, deleteSingleImageFromCategory);

module.exports = router;
