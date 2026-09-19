const mongoose = require('mongoose');

const heroSectionSchema = new mongoose.Schema(
  {
    subtitle: { type: String, required: false },
    slideImage: {
      type: [{ type: String }],
      validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
    },
    slideImagePublicIds: {
      type: [{ type: String }],
    },
  },
  { timestamps: true },
);

function arrayLimit(val) {
  return val ? val.length <= 4 : true;
}

heroSectionSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;

    delete ret.__v;
    delete ret._id;
    delete ret.slideImagePublicIds;

    return {
      id: ret.id,
      subtitle: ret.subtitle || '',
      slideImage: ret.slideImage || [],
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt,
    };
  },
});

module.exports = mongoose.model('HeroSection', heroSectionSchema);
