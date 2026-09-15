const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const {
  createNotice,
  getAllNotice,
  deleteNotice,
} = require('../../controllers/homeController/noticeController');
const {
  getHeroData,
  createHeroData,
  updateHeroData,
  deleteHeroData,
} = require('../../controllers/homeController/heroSectionController');

//----------------> Notice CRUD <-------------------
router.route('/notice').get(getAllNotice).post(createNotice);
router.route('/notice/:id').delete(deleteNotice);

//-------------------> Hero Section Multer & CRUD <-------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const extName = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(extName, '')
        .toLowerCase()
        .split(' ')
        .join('-') +
      '-' +
      Date.now() +
      extName;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.route('/herosection').get(getHeroData).delete(deleteHeroData);
router.post('/herosection', upload.array('slideImage', 4), createHeroData);
router.put('/herosection', upload.array('slideImage', 4), updateHeroData);

module.exports = router;
