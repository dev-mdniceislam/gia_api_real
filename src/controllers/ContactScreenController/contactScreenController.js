const ContactInfo = require('../../models/ContactScreenModel/contactScreenModel');

exports.getContactInfo = async (req, res) => {
  try {
    const info = await ContactInfo.find().sort({ createdAt: -1 });
    if (!info || info.length === 0) {
      return res.error(404, 'Contact info not found', []);
    }

    const data = {
      contactInfo: info || [],
    };
    return res.success(200, 'Contact info fetched successfully', data);
  } catch {
    return res.error(500, 'Contact info fetched failed');
  }
};

exports.pushContactInfo = async (req, res) => {
  try {
    const { title, primaryDetail, subtext, iconName, link } = req.body;

    if (!title || !primaryDetail || !iconName) {
      return res.error(400, 'Title, primaryDetail are required.');
    }

    const count = await ContactInfo.countDocuments();
    if (count >= 8) {
      return res.error(400, 'Maximum limit of 8 contact items reached.');
    }

    const createContact = await ContactInfo.create({
      title,
      primaryDetail,
      subtext,
      iconName,
      link,
    });

    return res.success(201, 'Contact info added successfully', createContact);
  } catch {
    return res.error(500, 'Contact info added failed');
  }
};

exports.deleteContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedContact = await ContactInfo.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.error(404, 'Contact item not found');
    }

    return res.success(
      200,
      'Contact item deleted successfully',
      deletedContact,
    );
  } catch {
    return res.error(500, 'Failed to delete contact item');
  }
};
