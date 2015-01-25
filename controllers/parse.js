var formidable			=	require("formidable");
var	util				=	require('util');
var genericParser		=	require("genericparser");
var chardet				=	require("chardet");
var fs 					=	require('fs');

var parse = function (req, res, next) {
    tools.report("Requested PARSE with PUBLIC key = " + req.headers.public_key);
	var form = new formidable.IncomingForm();
	var file;
 	form.on('file', function (field, fileForm) {
		file = {
			name: fileForm.name,
			path: fileForm.path,
			ext: fileForm.name.substring(fileForm.name.lastIndexOf('.') + 1, fileForm.name.length),
			uploadedDate: new Date(),
			lastModifiedDate: fileForm.lastModifiedDate,
			type: fileForm.type,
			size: fileForm.size,
			encoding: chardet.detectFileSync(fileForm.path),
			publicKey: req.params.publicKey
		};
        tools.report("New file detected: " + fileForm.name);
	});
	form.on('end', function () {
		console.log("EXT = " + file.ext);
		genericParser.parse(file.path, file.ext, function (result) {	
			if (result !== undefined && result.length > 0)
				return next(null, result);
			return next("Empty data -- Parse Error", null);
		});
	});
	form.on('error', function (err) {
		return next("from: " + req.url + " : An error occured on the file upload : " + err, result);// <== ICI A GARDE Et VIRER EN DeSSOUS, voir comment retourner erreur a la place du null
	});
	form.parse(req);
	return next();
}

module.exports = parse;