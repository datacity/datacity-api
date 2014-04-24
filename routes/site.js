var express = require('express');
var router = express.Router();

/*
 * POST to adduser.
 */
router.post('/users/add', function(req, res) {
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
 * delete an user
 */
router.delete('/users/:publicKey', function(req, res) {
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

module.exports = router;