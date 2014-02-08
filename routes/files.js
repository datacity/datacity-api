var formidable = require('formidable');
var genericParser = require('genericparser');
var fs = require('fs');

var uploadDir = "./uploads/";

/*
 * Files Routes
 */
exports.post = function(req, res) {
  var form = new formidable.IncomingForm();
  var files = [];

  form.uploadDir = uploadDir;
  form.on('file', function(field, file) {
      console.log(file.name);
      files.push({
        name: file.name,
        path: file.path.replace(/^.*(\\|\/|\:)/, '')
      });
      // TODO : Save the file name with his path
  });
  form.on('end', function() {
      res.json(200, {
        status: "success", 
        data: {
          "files": files
        }
      });
  });
  form.on('error', function(err) {
      res.json(200, { status: "error", message: "Error to upload files" });
  });
  form.parse(req);
};

exports.get = function(req, res) {
  var id = req.params.id;
  var filePath = uploadDir + id;

  fs.exists(filePath, function(exists) {
  if (exists) {
    res.download(filePath);
    // TODO : res.download(filePath, "toto.xml"); // the 2nd param can rename the downloaded file. To be used when the file name will be saved.
  } else {
    res.statusCode = 404;
    return res.send('Error 404: No file found');
  }
});
};