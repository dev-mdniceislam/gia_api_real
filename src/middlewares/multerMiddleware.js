const multer = require('multer');
const path = require('path');

const createUploader = ({
  destination,
  allowedTypes,
  maxSizeMB,
  isNamedDate = true,
}) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination || './uploads/');
    },
    filename: (req, file, cb) => {
      const extName = path.extname(file.originalname);
      const cleanName = file.originalname
        .replace(extName, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');

      const timeStamp = isNamedDate ? `-${Date.now()}` : '';
      const fileName = `${cleanName}${timeStamp}${extName}`;

      cb(null, fileName);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedTypes && allowedTypes.length > 0) {
      const isAllowed = allowedTypes.includes(file.mimetype);
      if (isAllowed) {
        cb(null, true);
      } else {
        cb(
          new Error(
            `Invalid file type! Allowed types: ${allowedTypes.join(', ')}`,
          ),
          false,
        );
      }
    } else {
      cb(null, true);
    }
  };

  return multer({
    storage: storage,
    limits: {
      fileSize: (maxSizeMB || 5) * 1024 * 1024,
    },
    fileFilter: fileFilter,
  });
};

module.exports = createUploader;
