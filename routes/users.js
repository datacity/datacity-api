var elasticsearch = require('elasticsearch');
// see http://www.elasticsearch.org/blog/client-for-node-js-and-the-browser/

// Connect to localhost:9200 and use the default settings
var client = new elasticsearch.Client();

/*
 * Users Routes
 */

// POST create a new user
// TODO : Secure user creation to don't access form outside
exports.createUser = function (req, res) {
	var body = req.body;

	if (!body.publicKey || !body.privateKey || !body.quota || !body.username) {
		res.json(200, { status: "error", message: "Invalid request" });
	}

	client.create({
		index: 'users',
		type: 'user',
		body: {
			publicKey: body.publicKey,
			privateKey: body.privateKey,
			creation: new Date(),
			quota: {
				limit: body.quota,
				expiration: new Date(),
				counter: 0
			},
			username: body.username
		}
	}).then(function (resp) {
			res.json(200, {
				status: "success",
				data: "user created"
			});
			// res.json(200, { status: "error", message: "Failed to create the user. " + response });
		}, function (err) {
			res.json(200, {
				status: "error",
				data: err.message
			});
		});
};

// GET the list of users
exports.get = function (req, res) {
	client.search({
		index: 'users',
		type: 'user'
	}).then(function (resp) {
			var list = [];
			for (var user in resp.hits.hits) {
				list.push(resp.hits.hits[user]["_source"]);
			}
			res.json(200, {
				status: "success",
				data: list
			});
		}, function (err) {
			res.json(200, {
				status: "error",
				data: err.message
			});
		});
};

// DELETE the user
exports.remove = function (req, res) {
	//console.log("coucou");
	var id = req.params.publicKey;
	//console.log("publicKey = " + id);
	//client.deleteByQuery({
	//	index: 'users',
	//	type: 'user',
	//	q: 'publicKey: "' + id + '"'
	//}).then(function (resp) {
	//		console.log("yes");
	//		res.json(200, {
	//			status: "success",
	//			data: "User deleted"
	//		});
	//	}, function (err) {
	//			console.log("non");
	//			console.dir(err);
	//		res.json(200, {
	//			status: "error",
	//			data: err.message
	//		});
	//	});
};
