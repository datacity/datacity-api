var fs = require('fs');

exports.errorHandler = function(err, req, res, next) {
   if(err.type &&  err.type == 'error'){
      res.json(200, {
      	status: "error",
      	message: err.message});
      return;
   }
   next(err);
};

function checkPath(path, callback) {
	var uploadDir = "./uploads/";
	var dirName = uploadDir + path;
    fs.exists(dirName, function(exists) {
    	callback(exists);
    });
}

exports.check = function(req, res, next) {
	for (var key in req.params) {
		if (req.params[key] == "") {
			next({type:"error", message: "The value [" + key + "] is empty."});
			return;
		}
		switch (key) {
			case "publicKey":
				// checkPublicKey(req.params[key]);
				break;
			case "path":
				if (checkPath(req.params[key], function(exists) {
					if (!exists) {
						next({type:"error", message: "The file id [" + req.params[key] + "] doesn't exist."});
						return false;
					}
				})) {
					return;
				}
				break;
			default:
				next({type:"error", message: "Unknown identifier [" + key + "] in the url."});
				return;
				break;
		}
	}

	next();
};
