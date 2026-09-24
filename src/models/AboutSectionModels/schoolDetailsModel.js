const mongoose = require('mongoose');

const schoolDetails = new mongoose.Schema({
  description: { type: String, required: true },
  image: { type: String, required: true },
  imagePublicId: { type: String, required: true },
});

schoolDetails.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.imagePublicId;
    return ret;
  },
});

module.exports = mongoose.model('SchoolDetailsText', schoolDetails);
