/*
 * User middleware
 */
var middlewareUser = function(req, res, next, publicKey){
	var db = req.db;
	db.search({
		index: 'users',
		type: 'user',
		body: {
			query: {
				match: {
					publicKey: publicKey
				}
			}
		}
	}).then(function (resp) {
		if (resp.hits.hits.length == 0) {
			return next(new Error('user not found'));
		}
		else if (resp.hits.hits.length > 1) {
			return next(new Error('multiple users found'));
		}
		req.user = resp.hits.hits[0]["_source"];
		next();
	}, function (err) {
		return next(err);
	});
};

/*
 * File middleware
 */
var middlewareFile = function(req, res, next, path){
	var db = req.db;
	db.search({
		index: 'files',
		type: 'file',
		body: {
			query: {
				match: {
					path: path
				}
			}
		}
	}).then(function (resp) {
		if (resp.hits.hits.length == 0) {
			return next(new Error('file not found'));
		}
		else if (resp.hits.hits.length > 1) {
			return next(new Error('multiple files found'));
		}
		req.file = resp.hits.hits[0]["_source"];
		next();
	}, function (err) {
		return next(err);
	});
};

module.exports = {
	publicKey: middlewareUser,
	path: middlewareFile
};