const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "image");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
module.exports = multer({ storage: fileStorage, filter: fileFilter }).single(
  "image"
);
