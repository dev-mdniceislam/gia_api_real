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
    const transformed = {
      id: ret._id.toString(),
      ...ret,
    };
    delete transformed._id;
    delete transformed.__v;
    return transformed;
  },
});

module.exports = mongoose.model('HeroSection', heroSection);
