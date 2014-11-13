var formidable = require("formidable");
var chardet = require("chardet");

var download = function (req, res, next, db) {
    console.log("Requested DOWNLOAD with PUBLIC key = " + req.headers.public_key);
    console.log("File format : " + req.headers.accept);
    db.download(req.headers.file_name, next);
   // return next();
}

module.exports = download;


// db.create({
//             index: 'files',
//             type: 'file',
//             body: file,
//             refresh: true,
//         }).then(function (resp) {
                
//             }, function (err) {
//                 res.json(200, {
//                     status: "error",
//                     message: "from: " + req.url + " : Failed to save the file \"" + file.name + "\" . " + resp
//                 });
//             });