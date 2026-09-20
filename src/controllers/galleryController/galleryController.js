const Gallery = require('../../models/gallerySectionModels/galleryModel');
const deleteFileFromCloudinary = require('../../middlewares/fileDeleteMIddleware');
const getPublicIdFromURL = require('../../middlewares/getPublicIdFromURL');

// ১. গ্যালারির সব ক্যাটাগরি ডাটা গেট করা
exports.getGalleryDataAll = async (req, res) => {
  try {
    const galleryItems = await Gallery.find();
    return res.success(
      200,
      'Gallery images fetched successfully',
      galleryItems,
    );
  } catch {
    return res.error(
      500,
      'Gallery image fetched failed. please try again',
      null,
    );
  }
};

// ২. নতুন ক্যাটাগরি এবং ইমেজ তৈরি
exports.createCategory = async (req, res) => {
  let uploadedPublicIds = [];
  try {
    const { category } = req.body;

    if (req.files && req.files.length > 0) {
      uploadedPublicIds = req.files.map((f) => f.filename);
    }

    if (!category || !req.files || req.files.length === 0) {
      if (uploadedPublicIds.length > 0) {
        await deleteFileFromCloudinary(uploadedPublicIds);
      }
      return res.error(400, 'Category and images are required', null);
    }

    const existingCategory = await Gallery.findOne({ category });
    if (existingCategory) {
      if (uploadedPublicIds.length > 0) {
        await deleteFileFromCloudinary(uploadedPublicIds);
      }
      return res.error(400, 'Category already exists', null);
    }

    const imageUrls = req.files.map((file) => file.path);
    const publicIds = req.files.map((file) => file.filename);

    const newGallery = new Gallery({
      category,
      images: imageUrls,
      publicIds: publicIds,
    });

    await newGallery.save();
    return res.success(201, 'Category created successfully', newGallery);
  } catch (error) {
    if (uploadedPublicIds.length > 0) {
      await deleteFileFromCloudinary(uploadedPublicIds);
    }
    return res.error(500, error.message, null);
  }
};

// ৩. ID দিয়ে ক্যাটগরি ইমেজ পাওয়া
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

// ৪. বিদ্যমান ক্যাটাগরিতে নতুন ছবি পুশ করা
exports.pushImagesToCategory = async (req, res) => {
  let uploadedPublicIds = [];
  try {
    const { id } = req.params;

    if (req.files && req.files.length > 0) {
      uploadedPublicIds = req.files.map((f) => f.filename);
    }

    if (!req.files || req.files.length === 0) {
      return res.error(400, 'Please upload images to push', null);
    }

    const newUrls = req.files.map((file) => file.path);
    const newPublicIds = req.files.map((file) => file.filename);

    const updatedGallery = await Gallery.findByIdAndUpdate(
      id,
      {
        $push: {
          images: { $each: newUrls },
          publicIds: { $each: newPublicIds },
        },
      },
      { returnDocument: 'after', runValidators: true },
    );

    if (!updatedGallery) {
      await deleteFileFromCloudinary(uploadedPublicIds);
      return res.error(404, 'Category not found', null);
    }

    return res.success(
      200,
      'Images added successfully to category',
      updatedGallery,
    );
  } catch {
    if (uploadedPublicIds.length > 0) {
      await deleteFileFromCloudinary(uploadedPublicIds);
    }
    return res.error(500, 'Image push failed. please try again', null);
  }
};

// ২. ক্যাটাগরি এবং এর সব ইমেজ ডিলিট করা
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.error(404, 'Category not found to delete', null);
    }

    if (gallery.publicIds && gallery.publicIds.length > 0) {
      await deleteFileFromCloudinary(gallery.publicIds);
    }

    await Gallery.findByIdAndDelete(id);

    return res.success(
      200,
      'Category and all associated images deleted successfully',
      null,
    );
  } catch {
    return res.error(500, 'Category delete failed. Please try again', null);
  }
};

// ৩. ক্যাটাগরি থেকে একটি নির্দিষ্ট ইমেজ ডিলিট করা (publicId এবং URL দুটোই রিমুভ করা)

exports.deleteSingleImageFromCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { url } = req.body;

    if (!url) {
      return res.error(400, 'Image URL is required', null);
    }

    const publicId = getPublicIdFromURL(url);

    if (!publicId) {
      return res.error(400, 'Invalid image URL format', null);
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(
      id,
      {
        $pull: {
          images: url,
          publicIds: publicId,
        },
      },
      { returnDocument: 'after', runValidators: true },
    );

    if (!updatedGallery) {
      return res.error(404, 'Category not found', null);
    }

    await deleteFileFromCloudinary(publicId);

    return res.success(200, 'Image removed successfully', updatedGallery);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};
