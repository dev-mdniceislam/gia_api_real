const aboutItemShow = require('../../models/webshellModels/aboutItemShowModel');
const homeItemShow = require('../../models/webshellModels/homeItemShowModel');
const socialLinkModel = require('../../models/webshellModels/socialLinksModel');
const emergencyNotice = require('../../models/webshellModels/emergencyNoticeModel');

exports.getAllDataWebShell = async (req, res) => {
  try {
    // Parallel Execution with .lean() for faster performance
    const [about, home, socialLink, emrNotice] = await Promise.all([
      aboutItemShow.findOne().select('-__v -_id').lean(),
      homeItemShow.findOne().select('-__v -_id').lean(),
      socialLinkModel.findOne().select('-__v -_id').lean(),
      emergencyNotice.findOne().select('-__v -_id -imagePublicId').lean(),
    ]);

    const data = {
      aboutItemShow: about || null,
      homeItemShow: home || null,
      socialLink: socialLink || null,
      emergencyNotice: emrNotice || null,
    };

    return res.success(200, 'Webshell all data get successfully', data);
  } catch (error) {
    return res.error(500, 'Webshell all Data fetched failed');
  }
};
