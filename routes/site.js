var express = require('express');
var router = express.Router();
var middleware = require('./middleware');

/*
 * POST to adduser.
 */
router.post('/users/add', function(req, res, next) {
	var db = req.db;
	var body = req.body;

	db.create({
			index: 'users',
			type: 'user',
			id: body.publicKey,
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
			return (next(err));
		});
});

/*
 * delete an user
 */
router.delete('/users/:publicKey', function(req, res) {
    var db = req.db;
	var publicKey = req.params.publicKey;

	db.delete({
		index: 'users',
		type: 'user',
		id: publicKey
	}).then(function (resp) {
		res.json(200, {
			status: "success",
			data: "user deleted"
		});
	}, function (err) {
		console.trace(err.message);
		return (next(err));
	});
});

module.exports = router;