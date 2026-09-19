const AboutShowItemModel = require('../../models/webshellModels/aboutItemShowModel');

exports.getAboutShowItem = async (req, res) => {
  try {
    const getData = await AboutShowItemModel.findOne();

    if (!getData) {
      return res.error(404, 'About show item is not found.', []);
    }

    return res.success(200, 'About show item fetched successfully.', getData);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

exports.updateAboutShowItem = async (req, res) => {
  try {
    const updateData = req.body;
    const update = await AboutShowItemModel.findOneAndUpdate(
      {},
      { $set: updateData },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    return res.success(201, 'About show item is updated', update);
  } catch (error) {
    return res.error(500, error.message, null);
  }
};
