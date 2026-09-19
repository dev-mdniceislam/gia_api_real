const Admin = require('../../models/ownerAuthenticationModel/ownerAuthModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.error(400, 'Email and password are required.');
    }

    const findOwner = await Admin.findOne({ email: email });
    if (findOwner) {
      return res.error(400, 'This email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const registerData = new Admin({
      email: email,
      password: hashedPassword,
    });

    const registered = await registerData.save();
    return res.success(201, 'Registration successfull', registered);
  } catch {
    return res.error('401', 'Registration failed', null);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.error(400, 'Email and password are required.');
    }

    const findOwner = await Admin.findOne({ email: email });
    if (!findOwner) {
      return res.error(404, 'Email or Password invalid.');
    }

    const isValidPassword = await bcrypt.compare(password, findOwner.password);
    if (!isValidPassword) {
      return res.error(401, 'Email or Password invalid.');
    }

    const token = jwt.sign(
      { id: findOwner.id, email: findOwner.email },
      process.env.JWT_SECRET,
      { expiresIn: '10d' },
    );

    const ownerData = findOwner.toJSON();
    delete ownerData.password;

    return res.status(200).json({
      success: true,
      message: 'Admin login successfull',
      data: ownerData,
      token: token,
    });
  } catch {
    return res.error(401, 'Login failed. Please try again', null);
  }
};

// all admin get
exports.adminGetAll = async (req, res) => {
  try {
    const getAllAdmin = await Admin.find();

    if (!getAllAdmin || getAllAdmin.length === 0) {
      return res.error(404, 'No admins found');
    }

    return res.success(200, 'Admins fetched successfully', getAllAdmin);
  } catch {
    return res.error(500, 'Server error fetching admins', null);
  }
};

//delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.error(404, 'Admin not found to delete');
    }

    return res.success(200, 'Admin deleted successfully', deletedAdmin);
  } catch (error) {
    console.error('Delete Admin Error:', error);
    return res.error(500, 'Server error deleting admin', null);
  }
};
