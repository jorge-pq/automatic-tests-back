const util = require("util");
const path = require("path");
const multer = require("multer");


var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`${__filename}/../../../public`));
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
      return callback(message, null);
    }
    var filename = file.originalname;
    callback(null, filename);
  }
});
var uploadFiles = multer({ storage: storage }).fields([{name: 'main', maxCount: 1}, {name: 'images', maxCount: 10}]); //array("images", 10);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
