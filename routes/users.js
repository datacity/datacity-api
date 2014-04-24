var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var chardet = require('chardet');
var genericParser = require('genericparser');
var middleware = require('./middleware');

var uploadDir = "./uploads/";

/*
 * User middleware
 */
router.param('publicKey', middleware.publicKey);


/*
 * GET userlist.
 */
router.get('/list', function(req, res) {
    var db = req.db;

	db.search({
		index: 'users',
		type: 'user'
	}).then(function (resp) {
		var list = [];
		for (var user in resp.hits.hits) {
			list.push(resp.hits.hits[user]["_source"]);
		}
		res.json(200, {
			status: "success",
			data: list
		});
	}, function (err) {
		console.trace(err.message);
		return (next(err));
	});
});

/*
 * Get an user
 */
router.get('/:publicKey', function(req, res) {
	res.json(200, {
		status: "success",
		data: req.user
	});
});


/*
 * POST add new files
 */
router.post('/:publicKey/files/add', function(req, res) {
	var db = req.db;
	var publicKey = req.params.publicKey;
	var form = new formidable.IncomingForm();
	var files = [];
	form.uploadDir = uploadDir;
	form.on('file', function (field, fileForm) {
		var file = {
			name: fileForm.name,
			path: fileForm.path.replace(/^.*(\\|\/|\:)/, ''),
			uploadedDate: new Date(),
			lastModifiedDate: fileForm.lastModifiedDate,
			type: fileForm.type,
			size: fileForm.size,
			encoding: chardet.detectFileSync(fileForm.path),
			publicKey: publicKey
		};
		db.create({
			index: 'files',
			type: 'file',
			body: file
		}).then(function (resp) {
				
			}, function (err) {
				res.json(200, {
					status: "error",
					message: "from: " + req.url + " : Failed to save the file \"" + file.name + "\" . " + resp
				});
			});
		files.push(file);
	});
	form.on('end', function () {
		res.json(200, {
			status: "success",
			data: {
				"files": files
			}
		});
	});
	form.on('error', function (err) {
		res.json(200, {
			status: "error",
			message: "from: " + req.url + " : An error occured on the file upload : " + err
		});
	});
	form.parse(req);
});

module.exports = router;