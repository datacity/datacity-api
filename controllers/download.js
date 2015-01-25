var formidable = require("formidable");
var chardet = require("chardet");
var util = require("util");

var download = function (req, res, next, db) {
    tools.report("Requested DOWNLOAD with PUBLIC key = " + req.headers.public_key);
    tools.report("File format : " + req.headers.accept);
    tools.report("REQUESTED: " + util.inspect(req.params));
    db.download(req.params.slugdataset, req.params.format, next);
}

module.exports = download;