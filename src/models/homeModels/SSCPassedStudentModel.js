const { Double } = require('mongodb');
const mongoose = require('mongoose');

const sscpassedstudent = new mongoose.Schema({
  name: { type: String, required: true },
  roll: { type: Number, required: false, default: null },
  examName: { type: String, required: false, default: '' },
  gpa: { type: Number, require: true },
  image: { type: String, required: false, default: '' },
});

sscpassedstudent.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

    const formatImageData = ret.image
      ? `${BASE_URL}/uploads/${ret.image}`
      : null;

    return {
      id: ret._id,
      name: ret.name,
      roll: ret.roll || '',
      examName: ret.examName || '',
      gpa: ret.gpa,
      image: formatImageData,
    };
  },
});

module.exports = mongoose.model('SSCPassedStudent', sscpassedstudent);
