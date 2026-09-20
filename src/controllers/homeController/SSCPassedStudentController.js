const SSCStudent = require('../../models/homeModels/SSCPassedStudentModel');
const deleteFileFromCloudinary = require('../../middlewares/fileDeleteMIddleware');

// all SSC student get
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

// SSC Student get by id
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

// SSC student create
exports.createSSCStudent = async (req, res) => {
  try {
    const { name, roll, examName, gpa } = req.body;

    if (!name || !gpa || !req.file) {
      if (req.file && req.file.filename) {
        await deleteFileFromCloudinary(req.file.filename);
      }
      return res.error(400, 'Name, GPA, and Image are required', null);
    }

    if (roll) {
      const existingStudent = await SSCStudent.findOne({ name, roll });

      if (existingStudent) {
        if (req.file && req.file.filename) {
          await deleteFileFromCloudinary(req.file.filename);
        }
        return res.error(
          400,
          'Student with this name and roll already exists',
          null,
        );
      }
    }

    const newStudent = new SSCStudent({
      name,
      roll: roll || null,
      examName: examName || '',
      gpa,
      image: req.file.path,
      imagePublicId: req.file.filename,
    });

    const savedStudent = await newStudent.save();

    return res.success(201, 'SSC student created successfully', savedStudent);
  } catch (error) {
    if (req.file && req.file.filename) {
      await deleteFileFromCloudinary(req.file.filename);
    }
    return res.error(500, error.message, null);
  }
};
// SSC student update by id
exports.updateSSCStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roll, examName, gpa } = req.body;

    const student = await SSCStudent.findById(id);
    if (!student) {
      if (req.file && req.file.filename) {
        await deleteFileFromCloudinary(req.file.filename);
      }
      return res.error(404, 'Student not found', null);
    }

    let imageName = student.image;
    let publicId = student.imagePublicId;

    if (req.file) {
      if (student.imagePublicId) {
        await deleteFileFromCloudinary(student.imagePublicId);
      }
      imageName = req.file.path;
      publicId = req.file.filename;
    }

    const updateData = {
      ...(name && { name }),
      ...(roll !== undefined && { roll }),
      ...(examName !== undefined && { examName }),
      ...(gpa && { gpa }),
      image: imageName,
      imagePublicId: publicId,
    };

    const updatedStudent = await SSCStudent.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.success(200, 'Student updated successfully', updatedStudent);
  } catch (error) {
    if (req.file && req.file.filename) {
      await deleteFileFromCloudinary(req.file.filename);
    }
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

    // Clean up stored image upon record deletion
    if (deletedStudent.imagePublicId) {
      await deleteFileFromCloudinary(deletedStudent.imagePublicId);
    }

    return res.success(200, 'Student deleted successfully', null);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};
