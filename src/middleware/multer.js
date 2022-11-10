const multer = require('multer');
const util = require("util");

var storage = multer.diskStorage({});
var limits = { fileSize: 500000 };

var uploadFiles = multer({ storage: storage, limits: limits }).fields([{name: 'main', maxCount: 1}, {name: 'images', maxCount: 10}]);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
