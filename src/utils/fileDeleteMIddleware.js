const fs = require('fs');
const path = require('path');

const deleteFiles = (fileArray) => {
  if (fileArray && fileArray.length > 0) {
    fileArray.forEach((fileName) => {
      const filePath = path.join(__dirname, '../../uploads/', fileName);
      fs.unlink(filePath, (err) => {
        if (err) console.log(`Failed to delete file: ${fileName}`, err);
      });
    });
  }
};

module.exports = deleteFiles;
