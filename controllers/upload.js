var formidable = require("formidable");
var chardet = require("chardet");

var upload = function (req, res, next, db) {
    console.log("Requested UPLOAD with PUBLIC key = " + req.headers.public_key);
    var form = new formidable.IncomingForm();
    var file;
    form.on('file', function (field, fileForm) {
        file = {
            name: fileForm.name,
            path: fileForm.path,
            uploadedDate: new Date(),
            lastModifiedDate: fileForm.lastModifiedDate,
            type: fileForm.type,
            size: fileForm.size,
            encoding: chardet.detectFileSync(fileForm.path),
            publicKey: req.headers.public_key
        };
        console.log("New file detected: " + fileForm.name);
    });
    form.on('end', function () {
        db.bulk(file, next);
    });
    form.on('error', function (err) {
        return next("from: " + req.url + " : An error occured on the file upload : " + err, null);// <== ICI A GARDE Et VIRER EN DeSSOUS, voir comment retourner erreur a la place du null
    });
    form.parse(req);
    return next();
}

module.exports = upload;
