var fs = require('fs');
var elasticsearch = require('elasticsearch');
//see http://www.elasticsearch.org/blog/client-for-node-js-and-the-browser/

//Connect to localhost:9200 and use the default settings
var client = new elasticsearch.Client();

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
exports.errorHandler = function (err, req, res, next) {
	if (err.type && err.type == 'error') {
		res.json(200, {
			status: "error",
			message: err.message
		});
		return;
	}
	next(err);
};

function checkPath(path, callback) {
	var uploadDir = "./uploads/";
	var dirName = uploadDir + path;
	fs.exists(dirName, function (exists) {
		callback(exists);
	});
}

function checkPublicKey(publicKey, callback) {
	client.search({
		index: 'users',
		type: 'user',
		q: 'publicKey:' + publicKey
	}).then(function (resp) {
			callback(resp.hits.hits.length);
		}, function (err) {
			callback(0);
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
exports.check = function (req, res, next) {
	for (var key in req.params) {
		//if (req.params[key] == "") {
		//	next({ type: "error", message: "The value [" + key + "] is empty." });
		//	return;
		//}
		switch (key) {
			case "publicKey":
				//if (checkPublicKey(req.params[key], function (nbUsers) {
				//	if (nbUsers == 0) {
				//		next({ type: "error", message: "The public key [" + req.params[key] + "] doesn't exist." });
				//		return false;
				//	}
				//})) {
				//	return;
				//}
				break;
			case "path":
				if (checkPath(req.params[key], function (exists) {
					if (!exists) {
						next({ type: "error", message: "The file id [" + req.params[key] + "] doesn't exist." });
						return false;
					}
				})) {
					return;
				}
				break;
			default:
				next({ type: "error", message: "Unknown identifier [" + key + "] in the url." });
				return;
				break;
		}
	}
	next();
};

/**
 * This function will check the number of requests authorized by the user
 * @param  {Object}   req  the server request object
 * @param  {Object}   res  the server response object
 * @param  {Function} next a callback to the next function
 */
exports.quota = function (req, res, next) {
	var id = req.params.publicKey;

	client.search({
		"index": "users",
		"type": "user",
		"body": {
			"query": {
				"match": {
					"publicKey": id
				}
			}
		}
	}).then(function (resp) {
			var quota = resp.hits.hits[0]["_source"].quota;
			var currentDate = new Date();
			var expiration = new Date(quota.expiration);
			if (expiration < currentDate) {
				var newDate = new Date();
				newDate.setDate(newDate.getDate() + 1);
				client.update({
					index: 'users',
					type: 'user',
					id: resp.hits.hits[0]["_id"],
					body: {
						script: "ctx._source.quota.counter = 1; ctx._source.quota.expiration = date",
						upsert: {
							quota: {
								counter: 1,
								expiration: "now+1d"
							}
						},
						params: {
							date: newDate
						}
					}
				});
				next();
				return;
			}
			if (quota.counter >= quota.limit) {
				next({ type: "error", message: "You have excedeed you quota requests" });
				return;
			} else {
				client.update({
					index: 'users',
					type: 'user',
					id: resp.hits.hits[0]["_id"],
					body: {
						script: "ctx._source.quota.counter += 1;",
						upsert: {
							quota: {
								counter: 1,
								expiration: "now+1d"
							}
						}
					}
				});
				next();
				return;
			}
		}, function (err) {
			next({ type: "error", message: err.message });
			return;
		});

};
