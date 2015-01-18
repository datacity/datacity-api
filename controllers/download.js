var formidable = require("formidable");
var chardet = require("chardet");

var download = function (req, res, next, db) {
    console.log("Requested DOWNLOAD with PUBLIC key = " + req.headers.public_key);
    console.log("File format : " + req.headers.accept);
    db.download(req.params.slugdataset, next);
   // return next();
}

module.exports = download;