const SSCStudent = require('../../models/homeModels/SSCPassedStudentModel');

exports.sscStudentGetAll = async (req, res) => {
  try {
    const data = await SSCStudent.find().sort({ gpa: -1 });
    if (!data || data.length === 0) {
      return res.error(404, 'No SSC students found', []);
    }

    return res.success(200, 'SSC students fetched successfully', data);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

exports.getSSCStudentsById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.error(400, 'Student ID is required', null);
    }

    const student = await SSCStudent.findById(id);
    if (!student) {
      return res.error(
        404,
        'Student not found. Change student ID and try again',
        null,
      );
    }

    return res.success(200, 'Student fetched successfully', student);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

exports.createSSCStudent = async (req, res) => {
  try {
    const { name, roll, examName, gpa } = req.body;

    if (!name || !gpa) {
      return res.error(400, 'Name and GPA are required', null);
    }

    if (roll) {
      const existingStudent = await SSCStudent.findOne({ name, roll });

      if (existingStudent) {
        return res.error(
          400,
          'Student with this name and roll already exists',
          null,
        );
      }
    }

    const imageName = req.file ? req.file.filename : '';

    const newStudent = new SSCStudent({
      name,
      roll: roll || null,
      examName: examName || '',
      gpa,
      image: imageName,
    });

    const savedStudent = await newStudent.save();

    return res.success(201, 'SSC student created successfully', savedStudent);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

exports.updateSSCStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roll, examName, gpa } = req.body;

    const student = await SSCStudent.findById(id);
    if (!student) {
      return res.error(404, 'Student not found', null);
    }

    const imageName = req.file ? req.file.filename : student.image;

    const updatedStudent = await SSCStudent.findByIdAndUpdate(
      id,
      { name, roll, examName, gpa, image: imageName },
      { new: true, runValidators: true },
    );

    return res.success(200, 'Student updated successfully', updatedStudent);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

exports.deleteSSCStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await SSCStudent.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.error(404, 'Student not found to delete', null);
    }

    return res.success(200, 'Student deleted successfully', null);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};
