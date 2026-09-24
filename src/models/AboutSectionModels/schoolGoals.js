const mongoose = require('mongoose');

const schoolFeature = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
});

schoolFeature.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const schoolGoalsSchema = new mongoose.Schema(
  {
    goals: [{ type: String, required: true, trim: true }],
    feature: [schoolFeature],
    commitment: [{ type: String, required: true, trim: true }],
  },
  { timestamps: true },
);

schoolGoalsSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model(
  'SchoolGoalsFeatureCommitment',
  schoolGoalsSchema,
);
