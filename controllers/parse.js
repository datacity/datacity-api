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
		var ext = file.name.split('.').pop().toLowerCase();
		var parser = genericParser(ext);


		if (ext.length == 0) {
			return next(new Error('Unable to get the file extension'), null);
		}
		var parser = genericParser(ext);
		if (!parser) {
			return next(new Error("the file [" + name + "] can't be parsed. Incompatible file type."), null);
		}
		parser.on("error", function (err) {
            tools.report("Parser error ! ext = " + ext + " and err = " + err + " // path=" + file.path);
			return next(new Error(err), null);
		});
		parser.parse(file.path, false, function (result, index) {	
			if (result && result != undefined)
				return next(null, result);
		});
	});
	form.on('error', function (err) {
		return next("from: " + req.url + " : An error occured on the file upload : " + err, result);// <== ICI A GARDE Et VIRER EN DeSSOUS, voir comment retourner erreur a la place du null
	});
	form.parse(req);
	return next();
}

module.exports = parse;