const mongoose = require('mongoose');

const HomeIsShowSchema = new mongoose.Schema({
  showEmergencyNotice: { type: Boolean, required: true },
  showAboutMe: { type: Boolean, required: true },
  showNoticeBoard: { type: Boolean, required: true },
  showAcademicWork: { type: Boolean, required: true },
  showAchievement: { type: Boolean, required: true },
  showGallery: { type: Boolean, required: true },
  showGuardianComments: { type: Boolean, required: true },
  showMotivateCard: { type: Boolean, required: true },
  showDialogueImage: { type: Boolean, required: true },
  passedStudentBanner: { type: Boolean, required: true },
});

HomeIsShowSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('HomeIsShow', HomeIsShowSchema);
