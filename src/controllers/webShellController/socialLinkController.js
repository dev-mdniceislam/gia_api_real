const SocialLink = require('../../models/webshellModels/socialLinksModel');

// Create or Update Social Links
exports.createAndUpdateSocialLinks = async (req, res) => {
  try {
    const links = Array.isArray(req.body) ? req.body : req.body.links;

    if (!Array.isArray(links)) {
      return res.status(400).json({
        success: false,
        message: 'Links must be provided as an array',
      });
    }

    // 1. Validation for missing fields
    for (const item of links) {
      if (!item.icon || !item.url) {
        return res.status(400).json({
          success: false,
          message: 'Both icon and url are required for each item.',
        });
      }
    }

    // 2. Validation for duplicate icons
    const icons = links.map((item) => item.icon);
    const uniqueIcons = new Set(icons);

    if (uniqueIcons.size !== icons.length) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate icons are not allowed.',
      });
    }

    // Save/Update in Database
    const updated = await SocialLink.findOneAndUpdate(
      {},
      { links },
      {
        returnDocument: 'after',
        upsert: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: 'Social links saved successfully',
      data: updated,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.error(400, messages[0]);
    }
    return res.error(500, 'Failed to save social links');
  }
};

// Fetch Social Links
exports.getSocialLinks = async (req, res) => {
  try {
    const socialLinks = await SocialLink.findOne();

    if (!socialLinks) {
      return res.error(404, 'No social links found');
    }
    return res.success(200, 'Social links fetched successfully', socialLinks);
  } catch {
    return res.error(500, 'Failed to fetch social links');
  }
};
