var formidable = require('formidable');
var elasticsearch = require('elasticsearch');
// see http://www.elasticsearch.org/blog/client-for-node-js-and-the-browser/
var genericParser = require('genericparser');
var fs = require('fs');

require('utils.js');

var uploadDir = "./uploads/";

// Connect to localhost:9200 and use the default settings
var client = new elasticsearch.Client();

/*
 * Files Routes
 */
// POST upload multiple user file
exports.post = function(req, res) {
    var id = req.params.id;
    if (!id) {
	res.json(200, { status: "error", message: "invalid ID in the request" });	
	return;
    }
    // TODO : check here id the user exists and get the elasticsearch user id
    var form = new formidable.IncomingForm();
    var files = [];

    form.uploadDir = uploadDir;
    form.on('file', function(field, file) {
	client.create({
	    index: 'files',
	    type: 'file',
	    body: {
		name: file.name,
		path: file.path.replace(/^.*(\\|\/|\:)/, ''),
		creation: new Date(),
		quota: body.quota,
		user: "putUserId" // TODO : put real user ID
	    }
	}, function (error, response) {
	    res.json(200, { status: "error", message: "Failed to save the file \"" + file.name + "\" . " + response });
	});

	files.push({
            name: file.name,
            path: file.path.replace(/^.*(\\|\/|\:)/, '')
	});
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
