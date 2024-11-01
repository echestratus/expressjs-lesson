const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload');
    },
    filename: function (req, file, cb) {
      const date = new Date(Date.now())
      const uniqueSuffix = date.getDate() + '' + (date.getMonth() + 1) + '' + date.getFullYear() + '' + date.getHours() + '' + date.getMinutes() + '' + date.getSeconds();
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
  });
  
const upload = multer({ storage: storage });

module.exports = {
    upload
}