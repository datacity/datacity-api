var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/list', function(req, res) {
    var db = req.db;

	db.search({
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
		console.trace(err.message);
	});
});

/*
 * POST to adduser.
 */
router.post('/add', function(req, res) {
	var db = req.db;
	var body = req.body;

	db.create({
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
			data: "User created"
		});
	}, function (err) {
		console.trace(err.message);
	});
});

/*
 * Get an user
 */
router.get('/:publicKey', function(req, res) {
    var db = req.db;
	var user = req.params.publicKey;

	db.search({
		index: 'users',
		type: 'user',
		body: {
			query: {
				match: {
					publicKey: user
				}
			}
		}
	}).then(function (resp) {
		var user = resp.hits.hits[0];
		res.json(200, {
			status: "success",
			data: user
		});
	}, function (err) {
		console.trace(err.message);
	});
});

/*
 * delete an user
 */
router.delete('/:publicKey', function(req, res) {
    var db = req.db;
	var publicKey = req.params.publicKey;

	db.deleteByQuery({
		index: 'users',
		type: 'user',
		q: 'publicKey: "' + publicKey + '"'
	}).then(function (resp) {
		var shards = resp["_indices"].users["_shards"];
		if (shards.failed == 0) {
			res.json(200, {
				status: "success",
				data: "user deleted"
			});
		} else {
			res.json(200, {
				status: "error",
				message: "successful: " + shards.successful + ", failed: " + shards.failed + ", total: " + shards.total
			});
		}
	}, function (err) {
		console.trace(err.message);
	});
});

/*
 * update an user
 */
router.delete('/:publicKey', function(req, res) {
    var db = req.db;
	var publicKey = req.params.publicKey;

	// TODO make update on user
});

module.exports = router;