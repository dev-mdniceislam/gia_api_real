const mongoose = require('mongoose');

const sscPassedStudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    roll: {
      type: Number,
      default: null,
    },
    examName: {
      type: String,
      default: '',
    },
    gpa: {
      type: Number,
      required: [true, 'GPA is required'],
    },
    image: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

// JSON Response Formatting
sscPassedStudentSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.imagePublicId;

    return ret;
  },
});

module.exports = mongoose.model('SSCPassedStudent', sscPassedStudentSchema);
