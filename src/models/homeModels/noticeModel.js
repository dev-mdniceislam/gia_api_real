const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true },
);

noticeSchema.set('toJSON', {
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

module.exports = mongoose.model('Notice', noticeSchema);
