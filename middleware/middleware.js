var fs = require('fs');

/**
 * This module is a security module.
 * It will be used each times we wan't check the parameters sended to an api call
 * @module middleware
 */

/**
 * Will send an error to the response
 * @param  {Object}   err  error to send to the client
 * @param {string} err.type the type of the error 
 * @param {string} err.message the message of the error
 * @param  {Object}   req  the server request object
 * @param  {Object}   res  the server response object
 * @param  {Function} next a callback to the next function
 * @return {void}
 */
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


/**
 * This function will check all of parameters from req.params and call an apropriate function
 * who will check each params of the request sended.
 * @param  {Object}   req  the server request object
 * @param  {string} req.params get parameters related to the client request
 * @param  {Object}   res  the server response object
 * @param  {Function} next a callback to the next function
 * @return {void}
 */
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
