const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    primaryDetail: {
      type: String,
      required: true,
      trim: true,
    },
    subtext: {
      type: String,
      default: '',
      trim: true,
    },
    iconName: {
      type: String,
      required: true,
      enum: ['phone', 'email', 'location', 'time', 'facebook', 'telegram'],
      trim: true,
    },
    link: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
