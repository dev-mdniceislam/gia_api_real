const mongoose = require('mongoose');

// ১. Single Candidate Schema
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
    // Reference to Parent Batch
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SSCPassedStudentFormat',
      required: true,
    },
  },
  { timestamps: true },
);

passedSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.batchId;
    delete ret.imagePublicId;
    delete ret.__v;
    return ret;
  },
});

// ২. Parent Batch Schema
const sscPassedFormatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    candidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PassedStudent',
      },
    ],
  },
  { timestamps: true },
);

sscPassedFormatSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const SSCPassedStudentFormat = mongoose.model(
  'SSCPassedStudentFormat',
  sscPassedFormatSchema,
);
const PassedStudent = mongoose.model('PassedStudent', passedSchema);

module.exports = {
  SSCPassedStudentFormat,
  PassedStudent,
};
