const mongoose = require('mongoose');
const { validate } = require('../homeModels/heroSectionModel');

const gallerySchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    images: {
      type: [{ type: String }],
      validate: [galleryImageLimit, '{PATH} exceeds the limit of 10'],
    },
  },
  {
    timestamps: true,
  },
);

function galleryImageLimit(val) {
  return val.length <= 10;
}

gallerySchema.set('toJSON', {
  transform: (doc, ret) => {
    const BASE_URL = process.env.BASE_URL;
    const formatImages = (ret.images || []).map((img) => {
      const fileName = img.includes('/') ? img.split('/').pop() : img;
      return `${BASE_URL}/uploads/${fileName}`;
    });
    return {
      id: ret._id.toString(),
      category: ret.category,
      images: formatImages,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt,
    };
  },
});

module.exports = mongoose.model('GalleryImages', gallerySchema);
