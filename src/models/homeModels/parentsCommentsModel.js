const mongoose = require('mongoose');

const ParentsComments = new mongoose.Schema(
  {
    quote: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male',
    },
    relation: { type: String, required: false, default: 'অভিভাবক' },
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

ParentsComments.set('toJSON', {
  transform: (doc, ret) => {
    const transformed = {
      id: ret._id.toString(),
      ...ret,
    };
    delete transformed.__v;
    delete transformed._id;
    return transformed;
  },
});

module.exports = mongoose.model('ParentsComments', ParentsComments);
