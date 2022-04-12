const multer = require("multer");
const path = require('path');


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filePath = path.join(__dirname, '../../resources/images');
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

var uploadFile = multer({ storage: storage});
module.exports = uploadFile;
