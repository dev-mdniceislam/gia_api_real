const Gallery = require('../../models/gallerySectionModels/galleryModel');
const deleteFiles = require('../../middlewares/fileDeleteMIddleware');

// Gallery images get All
exports.getGalleryDataAll = async (req, res) => {
  try {
    const galleryItems = await Gallery.find();
    if (!galleryItems) {
      return res.error(404, 'Gallery image fetched failed', null);
    }
    return res.success(
      200,
      'Gallery images fetched successfully',
      galleryItems,
    );
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// (Create Category with Images)
exports.createCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category || !req.files || req.files.length === 0) {
      if (req.files) deleteFiles(req.files.map((f) => f.filename));
      return res.error(400, 'Category and images are required', null);
    }

    const existingCategory = await Gallery.findOne({ category });
    if (existingCategory) {
      if (req.files) deleteFiles(req.files.map((f) => f.filename));
      return res.error(400, 'Category already exists', null);
    }

    const imageNames = req.files.map((file) => file.filename);

    const newGallery = new Gallery({
      category,
      images: imageNames,
    });

    await newGallery.save();
    return res.success(201, 'Category created successfully', newGallery);
  } catch (error) {
    if (req.files) deleteFiles(req.files.map((f) => f.filename));
    return res.error(500, error.message, null);
  }
};

// (Get Images by Category)
exports.getImagesByCategoryId = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.error(404, 'Category not found', null);
    }
    return res.success(200, 'Images fetched successfully', gallery);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// (Push Images to Existing Category)
exports.pushImagesToCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.error(400, 'Please upload images to push', null);
    }

    const newImageNames = req.files.map((file) => file.filename);
    const updatedGallery = await Gallery.findByIdAndUpdate(
      id,
      { $push: { images: { $each: newImageNames } } },
      { new: true, runValidators: true },
    );

    if (!updatedGallery) {
      deleteFiles(newImageNames);
      return res.error(404, 'Category not found', null);
    }

    return res.success(
      200,
      'Images added successfully to category',
      updatedGallery,
    );
  } catch (error) {
    if (req.files && req.files.length > 0) {
      deleteFiles(req.files.map((f) => f.filename));
    }
    return res.error(500, error.message, null);
  }
};

// (Delete Entire Category)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findByIdAndDelete(id);

    if (!gallery) {
      return res.error(404, 'Category not found to delete', null);
    }
    if (gallery.images && gallery.images.length > 0) {
      deleteFiles(gallery.images);
    }
    return res.success(
      200,
      'Category and all associated images deleted successfully',
      gallery,
    );
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// (Delete Single Image from Category)
exports.deleteSingleImageFromCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { imageName } = req.body;

    if (!imageName) {
      return res.error(400, 'imageName is required', null);
    }

    const targetFileName = imageName.includes('/')
      ? imageName.split('/').pop()
      : imageName;

    const updatedGallery = await Gallery.findByIdAndUpdate(
      id,
      { $pull: { images: targetFileName } },
      { new: true, runValidators: true },
    );

    if (!updatedGallery) {
      return res.error(404, 'Category or Image not found', null);
    }

    deleteFiles([targetFileName]);

    return res.success(200, 'Image removed successfully', updatedGallery);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};
