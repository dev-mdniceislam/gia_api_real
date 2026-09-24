const mongoose = require('mongoose');

// প্রতিটি লিঙ্ক আইটেমের স্কিমা
const linkItemSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
      enum: {
        values: ['facebook', 'youtube', 'linkedin', 'twitter', 'instagram'],
        message:
          'Icon is not a valid social icon. Supported icons are: facebook, youtube, linkedin, twitter, instagram.',
      },
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const socialLinksSchema = new mongoose.Schema(
  {
    links: [linkItemSchema],
  },
  { timestamps: true },
);

socialLinksSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return {
      links: ret.links,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt,
    };
  },
});

module.exports = mongoose.model('SocialLink', socialLinksSchema);
