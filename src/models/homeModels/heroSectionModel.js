const mongoose = require('mongoose');

const heroSection = new mongoose.Schema(
  {
    subtitle: { type: String, required: false },
    slideImage: {
      type: [{ type: String }],
      validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
    },
  },
  { timestamps: true },
);

function arrayLimit(val) {
  return val.length <= 4;
}

heroSection.set('toJSON', {
  transform: (doc, ret) => {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

    const formattedImages = (ret.slideImage || []).map((img) => {
      const fileName = img.includes('/') ? img.split('/').pop() : img;
      return `${BASE_URL}/uploads/${fileName}`;
    });
    delete ret.__v;
    delete ret._id;
    return {
      subtitle: ret.subtitle || '',
      slideImage: formattedImages,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt,
    };
  },
});

module.exports = mongoose.model('HeroSection', heroSection);
