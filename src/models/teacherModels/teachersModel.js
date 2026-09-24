const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Teacher name is required'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    qualification: {
      type: String,
      default: '',
    },
    experience: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    isLeadership: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

// JSON Response Formatting
teacherSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.imagePublicId;
    delete ret.isLeadership;

    return ret;
  },
});

module.exports = mongoose.model('TeacherModel', teacherSchema);
