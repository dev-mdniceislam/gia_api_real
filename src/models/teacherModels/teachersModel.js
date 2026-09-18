const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  qualification: { type: String, default: '' },
  experience: { type: String, default: '' },
  departmentId: { type: String, required: true },
  image: { type: String, default: '' },
  isLeadership: { type: Boolean, default: false },
  email: { type: String, default: '' },
  bio: { type: String, default: '' },
});

teacherSchema.set('toJSON', {
  transform: (doc, ret) => {
    const id = ret._id;
    delete ret.__v;
    delete ret._id;

    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
    const formatImageData = ret.image ? `${BASE_URL}/uploads/${ret.image}` : '';

    return {
      id: id,
      name: ret.name,
      designation: ret.designation,
      qualification: ret.qualification,
      experience: ret.experience,
      departmentId: ret.departmentId,
      imageUrl: formatImageData,
      isLeadership: ret.isLeadership,
      email: ret.email,
      bio: ret.bio,
    };
  },
});

module.exports = mongoose.model('TeacherModel', teacherSchema);
