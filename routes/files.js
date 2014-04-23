var formidable = require('formidable');
var elasticsearch = require('elasticsearch');
var chardet = require('chardet');
var genericParser = require('genericparser');
var fs = require('fs');

var uploadDir = "./uploads/";

// Connect to localhost:9200 and use the default settings
var client = new elasticsearch.Client();

/*
 * Files Routes
 */
// POST upload multiple user file
exports.post = function (req, res) {
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
		//client.create({
		//	index: 'files',
		//	type: 'file',
		//	body: file
		//}).then(function (resp) {
		//		//console.dir(resp);
		//	}, function (err) {
		//		next({ type: "error", message: "Unable to save the file" });
				
		//		//res.json(200, { status: "error", message: "from: " + req.url + " : Failed to save the file \"" + file.name + "\" . " + resp });
		//	});
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
};

// GET The File from the path 
exports.parse = function (req, res) {
	var path = req.params.path;
	var id = req.params.publicKey;
	var dirName = uploadDir + path;

	client.search({
		index: 'files',
		type: 'file',
		q: 'path: "' + path + '"'
	}).then(function (resp) {
			if (resp.hits.hits.length == 0) {
				res.json(200, {
					status: "error",
					message: "unable to find the file in the database"
				});
				return;
			}
			var name = resp.hits.hits[0]["_source"]["name"];
			var typeTab = name.split('.');
			var type = typeTab[typeTab.length - 1].toLowerCase();
			var parser = genericParser(type);
			if (!parser) {
				res.json(200, {
					status: "error",
					message: "the file [" + name + "] can't be parsed. Incompatible file type."
				});
				return;
			}
			parser.on("error", function (error) {
				res.json(200, {
					status: "error",
					message: "from: " + req.url + " : " + error.message
				});
			});

			parser.parse(dirName, false, function (result, index) {
				if (result)
					res.json(200, {
						status: "success",
						data: result,
						message: "from: " + req.url + ": file parsed successfully!"
					});
			});
		}, function (err) {
			res.json(200, {
				status: "error",
				message: err.message
			});
		});
}

exports.get = function (req, res) {
	var path = req.params.path;
	var filePath = uploadDir + path;

	console.log(path);
	client.search({
		"index": "files",
		"type": "file",
		"body": {
			"query": {
				"match": {
					"path": path
				}
			}
		}
	}).then(function (resp) {
			if (response.hits.hits.length == 0) {
				resp.json(200, {
					status: "error",
					message: "no file found"
				});
				return;
			}
			var filename = response.hits.hits[0]["_source"]["name"];
			//resp.download(filePath, filename);
		}, function (err) {
			resp.json(200, { type: "error", message: "dsddssd = " + err.message });
		return;
	});
};


exports.list = function (req, res) {
	client.search({
		index: 'files',
		type: 'file'
	}).then(function (resp) {
			var list = [];
			for (var file in resp.hits.hits) {
				list.push({
					name: resp.hits.hits[file]["_source"]["name"],
					path: resp.hits.hits[file]["_source"]["path"],
					uploadedDate: resp.hits.hits[file]["_source"]["uploadedDate"],
					lastModifiedDate: resp.hits.hits[file]["_source"]["lastModifiedDate"],
					type: resp.hits.hits[file]["_source"]["type"],
					size: resp.hits.hits[file]["_source"]["size"],
					encoding: resp.hits.hits[file]["_source"]["encoding"],
					publicKey: resp.hits.hits[file]["_source"]["publicKey"]
				});
			}
			res.json(200, {
				status: "success",
				data: list
			});
		}, function (err) {
			res.json(200, {
				status: "error",
				message: err.message
			});
		});
};

exports.user = function (req, res, next) {
	var id = req.params.publicKey;
	client.search({
		index: 'files',
		type: 'file',
		q: 'publicKey:' + id
	}).then(function (resp) {
			var list = [];
			for (var file in resp.hits.hits) {
				list.push({
					name: resp.hits.hits[file]["_source"]["name"],
					path: resp.hits.hits[file]["_source"]["path"],
					uploadedDate: resp.hits.hits[file]["_source"]["uploadedDate"],
					lastModifiedDate: resp.hits.hits[file]["_source"]["lastModifiedDate"],
					type: resp.hits.hits[file]["_source"]["type"],
					size: resp.hits.hits[file]["_source"]["size"],
					encoding: resp.hits.hits[file]["_source"]["encoding"],
					publicKey: resp.hits.hits[file]["_source"]["publicKey"]
				});
			}
			res.json(200, {
				status: "success",
				data: list,
				message: "from: " + req.url
			});
		}, function (err) {
			res.json(200, {
				status: "error",
				message: "from: " + req.url + ": " + err.message
			});
		});
};

exports.delete = function (req, res) {
	var path = req.params.path;
	var id = req.params.publicKey;
	var dirName = uploadDir + path;

	fs.exists(dirName, function (exists) {
		if (exists) {
			client.deleteByQuery({
				index: 'files',
				type: 'file',
				q: 'path:"' + path + '"'
			}).then(function (resp) {

					fs.unlink(dirName, function (err) {
						if (err) throw err;

						res.json(200, {
							status: "success",
							data: "from: " + req.url + ": the file has been deleted"
						});
					});
				}, function (err) {
					res.json(200, {
						status: "error",
						data: err.message
					});
				});
		}
		else {
			res.json(200, {
				status: "error",
				data: "from: " + req.url + ": file doesn't exist on the file system"
			});
		}
	});
}
