var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var chardet = require('chardet');
var genericParser = require('datacity-parser');
var middleware = require('./middleware');
var events = require('events');
var eventEmitter = new events.EventEmitter();
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
		for (var i = 0; i< resp.hits.total; i++) {
			list.push(resp.hits.hits[i]["_source"]);
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
router.post('/:publicKey/files/add', function (req, res) {
	if (!req.user) return;
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
			body: file,
			refresh: true,
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
router.get('/:publicKey/files/list', function (req, res) {
	if (!req.user) return;
    var db = req.db;
	var publicKey = req.params.publicKey;
	db.search({
		index: 'files',
		type: 'file',
		refresh: true,
		size: 100,
		body: {
			query: {
				match: {
					publicKey: publicKey
				}
			}
		}
	}).then(function (resp) {
		var list = [];
		for (var i = 0; i < resp.hits.total; i++) {
			if (resp.hits.hits[i] && resp.hits.hits[i]["_source"])
				list.push(resp.hits.hits[i]["_source"]);
		}
		res.json(200, {
			status: "success",
			data: list
		});
	}, function (err) {
		res.json(200, {
			status: "error",
			message: "from: " + req.url + " : " + err.message
		});
	});
});

/*
 * GET parse the file with geenericparser
 */
router.get('/:publicKey/files/:path/parse', function (req, res, next) {
	if (!req.user) return;
	var db = req.db;
	var path = req.params.path;
	var dirName = uploadDir + path;
	
	var ext = req.file.name.split('.').pop().toLowerCase();
	if (ext.length == 0) {
		return next(new Error('Unable to get the file extension'));
	}
	var parser = genericParser(ext);
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
router.delete('/:publicKey/files/:path', function (req, res, next) {
	if (!req.user) return;
    var db = req.db;
	var path = req.params.path;
	var dirName = uploadDir + path;

	db.deleteByQuery({
		index: 'files',
		type: 'file',
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


/* PARTIE SOURCES */

function arrayObjectIndexOf(myArray, property) {
	if (!(myArray instanceof Array))
        return -1
    for (var i = 0, len = myArray.length; i < len; i++) {
		if (myArray[i][property]) return i;
	}
	return -1;
}

function formatArray(myArray, property) {
	for (var i = 0, len = myArray.length; i < len; i++) {
		for (var proper in myArray[i]) {
			myArray[i][proper] = myArray[i][proper].toLowerCase();
		}
	}
}

var generateProperJSON = function (file, databinding, id, sourceName) {
    if (databinding.length <= 0)
        return false;
	//formatArray(databiding);
	if (file instanceof Array) {
		// ITERATIONS SUR LE TABLEAU
		for (var i in file) {
			var currentObject = file[i];
			var jsonObj = {};
			// ITERATIONS SUR UN OBJET
			for (var elem in databinding) {
				jsonObj[databinding[elem].to] = currentObject[databinding[elem].from];
				//var indexObject = arrayObjectIndexOf(databinding, key);
				//if (indexObject != -1)
				//jsonObj[databinding[indexObject][key]] = currentObject[key];
			}
			jsonObj['sourceName'] = sourceName;

			//TODO: LIMITER LA BULK REQUEST A 1000
			eventEmitter.emit('line', jsonObj);
		}
		eventEmitter.emit('end');
	}
	return true;
}

var storeSourceOnElasticSearch = function (req, res, type) {
	var bodyArray = [];
	var db = req.db;
	eventEmitter.on('line', function (line) {
		bodyArray.push({ index: { _index: 'sources', _type: type } }, line);
	});
	eventEmitter.on('end', function () {
		db.bulk({
			body: bodyArray,
			refresh: true
		}, function (err, resp, status) {
				res.json(status, {
					status: "success",
					message: "from: " + req.url + ": You uploaded your source with success!"
				});
			});
	});
}

function renameProperty(obj, oldName, newName) {
	if (obj.hasOwnProperty(oldName)) {
		obj[newName] = obj[oldName];
		delete obj[oldName];
	}
	return obj;
};

router.post('/:publicKey/dataset/:datasetslug/source/:name/upload',  function(req, res, next) {
	if (!req.body || !req.body.jsonData || !req.body.databinding || !req.params.name || !req.params.datasetslug) {
		res.json(200, {
			status: "error",
			message: "from: " + req.url + ": Wrong parameters. You need to enter valid jsonData or a valid databiding"
		});
		return;
	}
	storeSourceOnElasticSearch(req, res, req.params.datasetslug);
	if (generateProperJSON(req.body.jsonData, req.body.databinding, req.params.publicKey, req.params.name) === false) {
        res.json(200, {
            status: "error",
            message: "from" + req.url + ": No columns selected"
        });
	}
});

router.get('/:publicKey/dataset/:datasetslug/download', function(req, res, next) {
    var db = req.db;
	if (!req.params.datasetslug) {
		res.json(200, {
			status: "error",
			message: "from: " + req.url + ": You need to enter a valid datasetslug or a valid publickey"
		});
		return;
	}

/*{"status":"success","data":
[
{"_index":"sources","_type":"testtest","_id":"xDRLMYqOSFKuZW-pneFTgg","_score":1,"_source":
	{"code_secteur":"SE","libelle":"Sécurité","sourceName":"vgfdvbgfbgf"}
},
{"_index":"sources","_type":"testtest","_id":"rzrMkGabRlqQEOd0Kql2Kg","_score":1,"_source":
	{"code_secteur":"SE","libelle":"Sécurité","sourceName":"vgfdvbgfbgf"}
},
{"_index":"sources","_type":"testtest","_id":"3KnV0IqETQSCDSC170V0Nw","_score":1,"_source":
	{"code_secteur":"TC","libelle":"Transports en*/



	var sourceName = 'sourceName:*';
	db.search({
		index: 'sources',
		type: req.params.datasetslug,
		size: '10000',
		q: sourceName
	}, function (error, response, status) {
		if (!response || !response.hits || !response.hits.hits) {
			res.json(status, {
				status: "error",
				message: "from: " + req.url + ": Source not founded!"
			});			
		}

		var content = response.hits.hits.filter(function(el) {
					return el._source;
		});
		res.json(status, {
			status: "success",
			data: content,
			message: "from: " + req.url + ": Source downloaded!"
		});
	});
});

router.get('/:publicKey/source/:category/model', function(req, res, next) {
	var db = req.db;
	db.indices.getMapping({
		index: 'sources'
	}, function (error, response, status) {
			var category = req.params.category;
			
			if (!category || !response || !response.sources
				|| !response.sources.mappings || !response.sources.mappings[category]
				|| !response.sources.mappings[category].properties 
				|| !response.sources[category] 
				|| !response.sources[category].properties) {
				res.json(200, {
					status: "error",
					message: "from: " + req.url + ": No mapping available. Maybe it's because there is no source uploaded in elasticsearch ?"
				});
				return;
			}
			var categoryMapping = Object.keys(response.sources[category].properties);
			res.json(200, {
				status: "success",
				data: categoryMapping,
				message: "from: " + req.url + ": Mapping sended"
			});
		});
});

module.exports = router;