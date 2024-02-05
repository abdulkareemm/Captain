const fs = require("fs");
//const path = require("path");
const deleteFile = (filePath) => {
  //filePath = path.join(__dirname, "..", filePath);
  //   const filepath = filePath.replaceAll("\\", "\\\\");
  //   console.log(filepath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

exports.deleteFile = deleteFile;
