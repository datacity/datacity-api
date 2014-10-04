//var genericparser	=	require("genericparser");
var formidable			=	require("formidable");
var	util				=	require('util');
var genericParser		=	require("genericparser");
var chardet				=	require("chardet");
var fs 					=	require('fs');

var parse = function (req, res, next) {
	console.log("Requested PARSE...");
	var form = new formidable.IncomingForm();
	var file;
	 /*form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      //res.end(util.inspect({fields: fields, files: files}));
      res.end();
    });*/
 	form.on('file', function (field, fileForm) {
		file = {
			name: fileForm.name,
			path: fileForm.path,
			uploadedDate: new Date(),
			lastModifiedDate: fileForm.lastModifiedDate,
			type: fileForm.type,
			size: fileForm.size,
			encoding: chardet.detectFileSync(fileForm.path),
			publicKey: req.params.publicKey
		};
		console.log(fileForm.name);
	});
	form.on('end', function () {
		var ext = file.name.split('.').pop().toLowerCase();
		var parser = genericParser(ext);


		if (ext.length == 0) {
			return next(new Error('Unable to get the file extension'));
		}
		var parser = genericParser(ext);
		if (!parser) {
			return next(new Error("the file [" + name + "] can't be parsed. Incompatible file type."));
		}
		parser.on("error", function (err) {
			console.log("Parser error ! ext = " + ext + " and err = " + err + " // path=" + file.path);
			return next(new Error(err));
		});
		parser.parse(file.path, false, function (result, index) {
			console.log("Parse done: " + result);
			if (result)
				res.json(200, {
					status: "success",
					data: result
				});
		});



/*
		res.json(200, {
			status: "success",
			data: {
				"file": file
			}
		});*/
	});
	form.on('error', function (err) {
		res.json(200, {
			status: "error",
			message: "from: " + req.url + " : An error occured on the file upload : " + err
		});
	});
	form.parse(req);
	return next();
}

module.exports = parse;