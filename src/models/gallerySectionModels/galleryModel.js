const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    images: [{ type: String, required: true }],
    publicIds: [{ type: String, required: true }],
  },
  { timestamps: true },
);

gallerySchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.publicIds;
    return ret;
  },
});

module.exports = mongoose.model('GalleryImages', gallerySchema);
