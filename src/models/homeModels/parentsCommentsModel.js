const mongoose = require('mongoose');

const ParentsCommentsSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      required: [true, 'কমেন্ট বা উক্তি দেওয়া বাধ্যতামূলক'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'নাম দেওয়া বাধ্যতামূলক'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male',
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'ইমেইল দেওয়া বাধ্যতামূলক'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'সঠিক ইমেইল দিন',
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    relation: {
      type: String,
      default: 'অভিভাবক',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'pending',
      lowercase: true,
    },
  },
  { timestamps: true },
);

// toJSON Transformation (Cleaner & Faster)
ParentsCommentsSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('ParentsComments', ParentsCommentsSchema);
