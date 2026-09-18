const Teacher = require('../../models/teacherModels/teachersModel');
const deleteImage = require('../../middlewares/fileDeleteMIddleware');

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ isLeadership: -1 });

    if (!teachers || teachers.length === 0) {
      return res.error(404, 'No teachers found', []);
    }

    return res.success(200, 'Teachers fetched successfully', teachers);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const {
      name,
      designation,
      qualification,
      experience,
      departmentId,
      isLeadership,
      leadershipTag,
      email,
      bio,
    } = req.body;

    if (!name || !designation || !departmentId) {
      return res.error(
        400,
        'Name, designation, and departmentId are required',
        null,
      );
    }

    const imageName = req.file ? req.file.filename : '';

    const newTeacher = new Teacher({
      name,
      designation,
      qualification: qualification || '',
      experience: experience || '',
      departmentId,
      image: imageName,
      isLeadership: isLeadership || false,
      leadershipTag: leadershipTag || '',
      email: email || '',
      bio: bio || '',
    });

    const savedTeacher = await newTeacher.save();

    return res.success(201, 'Teacher created successfully', savedTeacher);
  } catch (error) {
    if (req.file) {
      deleteImage();
    }
    return res.error(500, error.message, null);
  }
};

// ID অনুযায়ী সিঙ্গেল টিচার তথ্য পাওয়া
exports.getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.error(404, 'Teacher not found', null);
    }

    return res.success(200, 'Teacher fetched successfully', teacher);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// Teacher update by id
exports.updateTeacherInfoById = async (req, res) => {
  try {
    const { id } = req.params;
    const findData = await Teacher.findById(id);

    if (!findData) {
      if (req.file) {
        deleteImage([req.file.filename]);
      }
      return res.error(404, 'Teacher not found', null);
    }

    let imageName = findData.image;

    if (req.file) {
      if (findData.image) {
        deleteImage([findData.image]);
      }
      imageName = req.file.filename;
    }

    const updatedData = {
      ...req.body,
      image: imageName,
    };

    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return res.success(
      200,
      'Teacher info updated successfully',
      updatedTeacher,
    );
  } catch (error) {
    if (req.file) {
      deleteImage([req.file.filename]);
    }
    return res.error(500, error.message, null);
  }
};

exports.deleteTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByIdAndDelete(id);

    if (!teacher) {
      return res.error(404, 'Teacher not found to delete', null);
    }

    if (teacher.image) {
      deleteImage([teacher.image]);
    }

    return res.success(200, 'Teacher deleted successfully', null);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};
