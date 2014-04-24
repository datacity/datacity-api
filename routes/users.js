var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var chardet = require('chardet');
var genericParser = require('genericparser');
var middleware = require('./middleware');

var uploadDir = "./uploads/";

/*
 * User and file middleware
 */
router.param('publicKey', middleware.publicKey);
router.param('path', middleware.path);


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

/*
 * GET the list of files of the user
 */
router.get('/:publicKey/files/list', function(req, res) {
    var db = req.db;
	var publicKey = req.params.publicKey;

	db.search({
		index: 'files',
		type: 'file',
		body: {
			query: {
				match: {
					publicKey: publicKey
				}
			}
		}
	}).then(function (resp) {
		var list = [];
		for (var file in resp.hits.hits) {
			list.push(resp.hits.hits[file]["_source"]);
		}
		res.json(200, {
			status: "success",
			data: list
		});
	}, function (err) {
		console.trace(err.message);
		return next(err);
	});
});

/*
 * GET parse the file with geenericparser
 */
router.get('/:publicKey/files/:path/parse', function(req, res, next) {
	var db = req.db;
	var dirName = uploadDir + path;
	
	var name = req.file.name;
	var typeTab = name.split('.');
	var type = typeTab[typeTab.length - 1].toLowerCase();
	var parser = genericParser(type);
	if (!parser) {
		return next(new Error("the file [" + name + "] can't be parsed. Incompatible file type."));
	}
	parser.on("error", function (err) {
		return next(new Error(err));
	});
	parser.parse(dirName, false, function (result, index) {
		if (result)
			res.json(200, {
				status: "success",
				data: result
			});
	});
});


/*
 * delete a file of an user
 */
router.delete('/:publicKey/files/:path', function(req, res, next) {
    var db = req.db;
	var path = req.params.path;
	var dirName = uploadDir + path;

	db.deleteByQuery({
		index: 'users',
		type: 'user',
		q: 'path:"' + path + '"'
	}).then(function (resp) {
		fs.unlink(dirName, function (err) {
			if (err) {
				return next(new Error("Unable to delete the file on the file system"));
			}
			res.json(200, {
				status: "success",
				data: "user deleted"
			});
		});
	}, function (err) {
		console.trace(err.message);
		return (next(err));
	});
});






module.exports = router;