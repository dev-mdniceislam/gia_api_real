const {
  SSCPassedStudentFormat,
  PassedStudent,
} = require('../../models/homeModels/SSCPassedStudentModel');
const deleteFileFromCloudinary = require('../../middlewares/fileDeleteMiddleware');

// 1. Get Batch and Populate Candidates (GPA sorted high to low)
exports.sscStudentGetAll = async (req, res) => {
  try {
    const data = await SSCPassedStudentFormat.findOne().populate({
      path: 'candidates',
      options: { sort: { gpa: -1 } },
    });

    if (!data) {
      return res.error(404, 'No SSC student records found', null);
    }

    return res.success(200, 'SSC student records fetched successfully', data);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// 2. Create Batch
exports.createSSCBatch = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.error(400, 'Title is required', null);
    }

    const newBatch = await SSCPassedStudentFormat.findOneAndUpdate(
      {},
      {
        title,
      },
      { returnDocument: 'after', runValidators: true, upsert: true },
    );

    return res.success(201, 'SSC Batch created successfully', newBatch);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// 3. Add Candidate with Relational Populate Reference
exports.addCandidate = async (req, res) => {
  try {
    const { name, roll, examName, gpa } = req.body;

    if (!name || !gpa || !req.file) {
      if (req.file) {
        await deleteFileFromCloudinary(req.file.filename);
      }
      return res.error(400, 'Name, GPA, and Image are required', null);
    }

    const batch = await SSCPassedStudentFormat.findOne();
    if (!batch) {
      if (req.file) {
        await deleteFileFromCloudinary(req.file.filename);
      }
      return res.error(404, 'SSC Batch record not found', null);
    }

    // Duplicate Check using Child Collection Query
    const isDuplicate = await PassedStudent.findOne({
      batchId: batch.id,
      $or: [{ name: name.trim() }, { roll: roll ? roll.toString() : null }],
    });

    if (isDuplicate) {
      if (req.file) {
        await deleteFileFromCloudinary(req.file.filename);
      }
      return res.error(400, 'This student already exists', null);
    }

    // Save Candidate document separately
    const newCandidate = await PassedStudent.create({
      name: name.trim(),
      roll: roll || '',
      examName: examName || '',
      gpa: Number(gpa),
      image: req.file.path,
      imagePublicId: req.file.filename,
      batchId: batch.id,
    });

    // Push Candidate ID to Parent Model and Save
    batch.candidates.push(newCandidate.id);
    await batch.save();

    return res.success(200, 'Candidate added successfully', newCandidate);
  } catch (error) {
    if (req.file) {
      await deleteFileFromCloudinary(req.file.filename);
    }
    return res.error(500, error.message, null);
  }
};

// 4. Update Candidate
exports.updateCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { name, roll, examName, gpa } = req.body;

    const candidate = await PassedStudent.findById(candidateId);
    if (!candidate) {
      if (req.file) {
        await deleteFileFromCloudinary(req.file.filename);
      }
      return res.error(404, 'Candidate not found', null);
    }

    // Duplicate check across other candidates in same batch
    if (name || roll) {
      const isDuplicate = await PassedStudent.findOne({
        id: { $ne: candidateId },
        batchId: candidate.batchId,
        $or: [
          name ? { name: name.trim() } : {},
          roll ? { roll: roll.toString() } : {},
        ],
      });

      if (isDuplicate) {
        if (req.file) {
          await deleteFileFromCloudinary(req.file.filename);
        }
        return res.error(
          400,
          'Another candidate with this Name or Roll already exists',
          null,
        );
      }
    }

    // Image replacement logic
    if (req.file) {
      if (candidate.imagePublicId) {
        await deleteFileFromCloudinary(candidate.imagePublicId);
      }
      candidate.image = req.file.path;
      candidate.imagePublicId = req.file.filename;
    }

    if (name) candidate.name = name.trim();
    if (roll) candidate.roll = roll;
    if (examName) candidate.examName = examName;
    if (gpa) candidate.gpa = Number(gpa);

    await candidate.save();

    const updatedBatch = await SSCPassedStudentFormat.findById(
      candidate.batchId,
    ).populate({
      path: 'candidates',
      options: { sort: { gpa: -1 } },
    });

    return res.success(200, 'Candidate updated successfully', updatedBatch);
  } catch (error) {
    if (req.file?.filename) {
      await deleteFileFromCloudinary(req.file.filename);
    }
    return res.error(500, error.message, null);
  }
};

// 5. Delete Specific Candidate
exports.deleteCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidate = await PassedStudent.findById(candidateId);
    if (!candidate) {
      return res.error(404, 'Candidate not found to delete', null);
    }

    if (candidate.imagePublicId) {
      await deleteFileFromCloudinary(candidate.imagePublicId);
    }

    // Remove reference from parent batch
    await SSCPassedStudentFormat.findByIdAndUpdate(candidate.batchId, {
      $pull: { candidates: candidateId },
    });

    // Remove candidate document
    await PassedStudent.findByIdAndDelete(candidateId);

    // const updatedBatch = await SSCPassedStudentFormat.findOne().populate({
    //   path: 'candidates',
    //   options: { sort: { gpa: -1 } },
    // });

    return res.success(200, 'Candidate deleted successfully', []);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// 6. Delete Batch & Cascading Delete Candidates
exports.deleteSSCBatch = async (req, res) => {
  try {
    const batch = await SSCPassedStudentFormat.findOne();
    if (!batch) {
      return res.error(404, 'Batch record not found', null);
    }

    const candidates = await PassedStudent.find({ batchId: batch._id });

    // Clean Cloudinary images
    for (const item of candidates) {
      if (item.imagePublicId) {
        await deleteFileFromCloudinary(item.imagePublicId);
      }
    }

    // Delete all candidates and parent batch
    await PassedStudent.deleteMany({ batchId: batch._id });
    await SSCPassedStudentFormat.findByIdAndDelete(batch._id);

    return res.success(
      200,
      'Batch and all associated candidates deleted successfully',
      null,
    );
  } catch (error) {
    return res.error(500, error.message, null);
  }
};
