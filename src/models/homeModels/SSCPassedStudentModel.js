const mongoose = require('mongoose');

const passedSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    roll: {
      type: String,
      default: '',
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
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.imagePublicId;
        return ret;
      },
    },
  },
);

const sscPassedStudentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    candidates: [passedSchema],
  },
  { timestamps: true },
);

// JSON Response Formatting
sscPassedStudentSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('SSCPassedStudent', sscPassedStudentSchema);
