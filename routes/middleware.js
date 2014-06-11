/*
 * User middleware
 */
var middlewareUser = function(req, res, next, publicKey){
	var db = req.db;
	db.search({
		index: 'users',
		type: 'user',
		q: '_id:' + publicKey
	}).then(function (resp) {
		console.dir(resp.hits.hits);
		if (resp.hits.hits.length == 0) {
			return next(new Error('user not found'));
		}
		else if (resp.hits.hits.length > 1) {
			return next(new Error('multiple users found'));
		}
		req.user = resp.hits.hits[0]["_source"];
		var currentDate = new Date();
		var expiration = new Date(req.user.quota.expiration);
		if (expiration < currentDate) {
			var newDate = new Date();
			newDate.setDate(newDate.getDate() + 1);
			db.update({
				index: 'users',
				type: 'user',
				id: publicKey,
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
		if (req.user.quota.counter >= req.user.quota.limit) {
			return (next(new Error("You have excedeed you quota requests")));
		}
		db.update({
			index: 'users',
			type: 'user',
			id: publicKey,
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