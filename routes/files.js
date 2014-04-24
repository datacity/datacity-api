var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var chardet = require('chardet');
var genericParser = require('genericparser');
var middleware = require('./middleware');

/*
 * Create upload directory for the uploaded files
 */
var uploadDir = "./uploads/";
fs.exists(uploadDir, function (exists) {
	if (!exists) {
		fs.mkdir(uploadDir, function (error) {
			if (error) {
				console.log("Unable to create the upload directory : " + error);
			}
		});
	}
});

/*
 * File path middleware
 */
router.param('path', middleware.path);


/*
 * Get a file
 */
router.get('/:path', function(req, res) {
	var file = req.file;
	res.download(uploadDir + file.path, file.name);
});

module.exports = router;
