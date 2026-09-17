const express = require('express');
const router = express.Router();
const uploadFile = require('../../middlewares/multerMiddleware');

// Controller imports
const {
  getGalleryDataAll,
  createCategory,
  getImagesByCategoryId,
  pushImagesToCategory,
  deleteCategory,
  deleteSingleImageFromCategory,
} = require('../../controllers/galleryController/galleryController');

const upload = uploadFile({
  isNamedDate: true,
  maxSizeMB: 5,
});

// Base route: / (e.g., /api/gallery)
router
  .route('/')
  .get(getGalleryDataAll)
  .post(upload.array('images', 10), createCategory);

// Category route by ID: /:categoryId
router
  .route('/:id')
  .get(getImagesByCategoryId)
  .post(upload.array('images'), pushImagesToCategory)
  .delete(deleteCategory);

// Single image route: /:categoryId/images/:imageId
router.put('/:id', deleteSingleImageFromCategory);

module.exports = router;
