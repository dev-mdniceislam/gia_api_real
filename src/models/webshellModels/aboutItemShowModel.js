const mongoose = require('mongoose');

const AboutItemShowSchema = new mongoose.Schema(
  {
    detailsTextShow: { type: Boolean, required: true },
    detailsImageShow: { type: Boolean, required: true },
    goalsShow: { type: Boolean, required: true },
    ayatCardShow: { type: Boolean, required: true },
    schoolAttributesShow: { type: Boolean, required: true },
    showCommitment: { type: Boolean, required: true },
  },
  { timestamps: true },
);

AboutItemShowSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('AboutItemShow', AboutItemShowSchema);
