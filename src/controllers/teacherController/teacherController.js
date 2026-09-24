const Teacher = require('../../models/teacherModels/teachersModel');
const deleteImage = require('../../middlewares/fileDeleteMiddleware');

exports.getAllTeachers = async (req, res) => {
  try {
    const [leadershipTeachers, teachers] = await Promise.all([
      Teacher.find({ isLeadership: true }),
      Teacher.find({ isLeadership: false }),
    ]);

    if (leadershipTeachers.length === 0 && teachers.length === 0) {
      return res.error(404, 'No teachers found', []);
    }

    const data = {
      leadership: leadershipTeachers,
      teachers: teachers,
    };

    return res.success(200, 'Teachers fetched successfully', data);
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
      isLeadership,
      email,
      phone,
      bio,
    } = req.body;

    if (!name || !designation || !req.file) {
      if (req.file && req.file.filename) {
        await deleteImage(req.file.filename);
      }
      return res.error(400, 'Name, designation, and image are required', null);
    }

    const newTeacher = new Teacher({
      name,
      designation,
      qualification: qualification || '',
      experience: experience || '',
      image: req.file.path,
      imagePublicId: req.file.filename,
      isLeadership: isLeadership || false,
      email: email || '',
      phone: phone ? phone.toString() : '',
      bio: bio || '',
    });

    const savedTeacher = await newTeacher.save();

    return res.success(201, 'Teacher created successfully', savedTeacher);
  } catch {
    if (req.file && req.file.filename) {
      await deleteImage(req.file.filename);
    }
    return res.error(500, 'Teacher created failed', null);
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
  } catch {
    return res.error(500, 'Teacher fetched failed', null);
  }
};

// Teacher update by id
exports.updateTeacherInfoById = async (req, res) => {
  try {
    const { id } = req.params;

    const findData = await Teacher.findById(id);

    if (!findData) {
      if (req.file && req.file.filename) {
        await deleteImage(req.file.filename);
      }
      return res.error(404, 'Teacher not found', null);
    }

    let imageName = findData.image;
    let publicId = findData.imagePublicId;

    if (req.file) {
      if (findData.imagePublicId) {
        await deleteImage(findData.imagePublicId);
      }
      imageName = req.file.path;
      publicId = req.file.filename;
    }

    const updatedData = {
      ...req.body,
      image: imageName,
      imagePublicId: publicId,
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
  } catch {
    if (req.file && req.file.filename) {
      await deleteImage(req.file.filename);
    }
    return res.error(500, 'Teacher update failed', null);
  }
};

exports.deleteTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findByIdAndDelete(id);

    if (!teacher) {
      return res.error(404, 'Teacher not found to delete', null);
    }

    if (teacher.imagePublicId) {
      await deleteImage(teacher.imagePublicId);
    }

    return res.success(200, 'Teacher deleted successfully', null);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};
