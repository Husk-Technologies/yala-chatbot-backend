const multer = require("multer");

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // specify the destination directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // specify the file name
  },
});
// Initialize multer with the storage engine
const upload = multer({ storage: storage });
module.exports = upload;
