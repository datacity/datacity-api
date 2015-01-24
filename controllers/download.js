var formidable = require("formidable");
var chardet = require("chardet");

var download = function (req, res, next, db) {
    tools.report("Requested DOWNLOAD with PUBLIC key = " + req.headers.public_key);
    tools.report("File format : " + req.headers.accept);
    db.download(req.params.slugdataset, next);
   // return next();
}

module.exports = download;