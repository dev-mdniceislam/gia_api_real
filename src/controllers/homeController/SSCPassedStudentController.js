const SSCStudent = require('../../models/homeModels/SSCPassedStudentModel');
const deleteFileFromCloudinary = require('../../middlewares/fileDeleteMIddleware');

// 1. Get all SSC records (Title & Candidates list)
exports.sscStudentGetAll = async (req, res) => {
  try {
    // 1. একক ব্যাচ অবজেক্টটি খুঁজে বের করা
    const data = await SSCStudent.findOne();

    if (!data) {
      return res.error(404, 'No SSC student records found', null);
    }

    // 2. Mongoose Document-কে Plain Object-এ রূপান্তর করা
    const docObject = data.toJSON();

    // 3. candidates অ্যারেটিকে GPA অনুযায়ী (High to Low) সাজানো
    if (docObject.candidates && docObject.candidates.length > 0) {
      docObject.candidates.sort((a, b) => b.gpa - a.gpa);
    }

    return res.success(
      200,
      'SSC student records fetched successfully',
      docObject,
    );
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// 3. Create a main Title/Batch group
exports.createSSCBatch = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.error(400, 'Title is required', null);
    }

    const newBatch = new SSCStudent({
      title,
      candidates: [],
    });

    const savedBatch = await newBatch.save();
    return res.success(201, 'SSC Batch created successfully', savedBatch);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// 4. Add a candidate one-by-one to the candidates array
exports.addCandidate = async (req, res) => {
  try {
    const { name, roll, examName, gpa } = req.body;

    // 1. Required validation
    if (!name || !gpa || !req.file) {
      if (req.file && req.file.filename) {
        await deleteFileFromCloudinary(req.file.filename);
      }
      return res.error(400, 'Name, GPA, and Image are required', null);
    }

    const batch = await SSCStudent.findOne();

    if (!batch) {
      if (req.file && req.file.filename) {
        await deleteFileFromCloudinary(req.file.filename);
      }
      return res.error(404, 'SSC Batch record not found', null);
    }

    // 3. Duplicate check (batch.candidates অ্যারের ওপর)
    const isDuplicate = batch.candidates.some((item) => {
      const isNameMatch = item.name.toLowerCase() === name.trim().toLowerCase();
      const isRollMatch =
        roll && item.roll && item.roll.toString() === roll.toString();
      return isNameMatch || isRollMatch;
    });

    if (isDuplicate) {
      if (req.file && req.file.filename) {
        await deleteFileFromCloudinary(req.file.filename);
      }
      return res.error(400, 'This student already exists', null);
    }

    // 4. New candidate object
    const newCandidate = {
      name: name.trim(),
      roll: roll || '',
      examName: examName || '',
      gpa: Number(gpa),
      image: req.file.path,
      imagePublicId: req.file.filename,
    };

    // 5. candidates অ্যারেতে পুশ করে সেভ করা
    batch.candidates.push(newCandidate);
    await batch.save();

    return res.success(200, 'Candidate added successfully', batch);
  } catch (error) {
    if (req.file && req.file.filename) {
      await deleteFileFromCloudinary(req.file.filename);
    }
    return res.error(500, error.message, null);
  }
};

// 5. Update a specific candidate inside the candidates array
exports.updateCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { name, roll, examName, gpa } = req.body;

    const record = await SSCStudent.findOne();
    if (!record) {
      if (req.file && req.file.filename) {
        await deleteFileFromCloudinary(req.file.filename);
      }
      return res.error(404, 'Batch record not found', null);
    }

    const candidate = record.candidates.id(candidateId);
    if (!candidate) {
      if (req.file && req.file.filename) {
        await deleteFileFromCloudinary(req.file.filename);
      }
      return res.error(404, 'Candidate not found', null);
    }

    if (name || gpa || roll) {
      const isDuplicate = record.candidates.some((item) => {
        if (item.id.toString() === candidateId) return false;

        const isNameMatch = name && item.name === name.trim();
        const isRollMatch =
          roll && item.roll && item.roll.toString() === roll.toString();
        return isNameMatch || isRollMatch;
      });

      if (isDuplicate) {
        if (req.file && req.file.filename) {
          await deleteFileFromCloudinary(req.file.filename);
        }
        return res.error(
          400,
          'Another candidate with this Name or Roll already exists',
          null,
        );
      }
    }

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

    await record.save();

    return res.success(200, 'Candidate updated successfully', record);
  } catch (error) {
    if (req.file && req.file.filename) {
      await deleteFileFromCloudinary(req.file.filename);
    }
    return res.error(500, error.message, null);
  }
};

// 6. Delete a specific candidate from the array (and clean up Cloudinary image)
exports.deleteCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;

    // ১. সিস্টেমে থাকা একক ব্যাচটি খুঁজে বের করা
    const record = await SSCStudent.findOne();
    if (!record) {
      return res.error(404, 'Batch record not found', null);
    }

    // ২. candidates অ্যারে থেকে নির্দিষ্ট candidate খুঁজে বের করা
    const candidate = record.candidates.id(candidateId);
    if (!candidate) {
      return res.error(404, 'Candidate not found to delete', null);
    }

    // ৩. Cloudinary থেকে ছবি ডিলিট করা
    if (candidate.imagePublicId) {
      await deleteFileFromCloudinary(candidate.imagePublicId);
    }

    // ৪. candidates অ্যারে থেকে নির্দিষ্ট sub-document টি রিমুভ করা
    record.candidates.pull(candidateId);
    await record.save();

    return res.success(200, 'Candidate deleted successfully', record);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

// 7. Delete entire Batch group (with all candidate images)
exports.deleteSSCBatch = async (req, res) => {
  try {
    const record = await SSCStudent.findOne();
    if (!record) {
      return res.error(404, 'Batch record not found', null);
    }

    if (record.candidates && record.candidates.length > 0) {
      for (const candidate of record.candidates) {
        if (candidate.imagePublicId) {
          await deleteFileFromCloudinary(candidate.imagePublicId);
        }
      }
    }

    await SSCStudent.findByIdAndDelete(record.id);

    return res.success(
      200,
      'Batch and all associated candidates deleted successfully',
      null,
    );
  } catch (error) {
    return res.error(500, error.message, null);
  }
};
