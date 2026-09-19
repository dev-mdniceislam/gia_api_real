const HomeItemShow = require('../../models/webshellModels/homeItemShowModel');

exports.getHomeItemShow = async (req, res) => {
  try {
    const getData = await HomeItemShow.findOne();
    if (!getData) {
      return res.error(404, 'Home item show data not found', []);
    }

    return res.success(
      200,
      'Home item show data fetched successfully.',
      getData,
    );
  } catch (error) {
    return res.error(500, error.message, null);
  }
};

exports.updateHomeItemShow = async (req, res) => {
  try {
    const updateData = req.body;

    const update = await HomeItemShow.findOneAndUpdate(
      {},
      {
        $set: updateData,
      },
      { new: true, runValidators: true, upsert: true },
    );

    return res.success(
      201,
      'Home item show data updated successfully.',
      update,
    );
  } catch (error) {
    return res.error(500, error.message, null);
  }
};
