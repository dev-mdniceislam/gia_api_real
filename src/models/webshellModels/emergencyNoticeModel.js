const mongoose = require('mongoose');

const emergencyNotice = new mongoose.Schema(
  {
    badgeText: { type: String, trim: true },
    bodyText: { type: String, trim: true },
    dialogueImage: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
  },
  { timestamps: true },
);

emergencyNotice.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.imagePublicId;
    return ret;
  },
});

module.exports = mongoose.model('EmergencyNotice', emergencyNotice);
