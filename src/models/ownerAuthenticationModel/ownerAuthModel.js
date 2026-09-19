const mongoose = require('mongoose');

const ownerAuthSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

ownerAuthSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;

    return {
      id: ret._id,
      email: ret.email,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt,
    };
  },
});

module.exports = mongoose.model('OwnerAuth', ownerAuthSchema);
