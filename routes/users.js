var elasticsearch = require('elasticsearch');
// see http://www.elasticsearch.org/blog/client-for-node-js-and-the-browser/

// Connect to localhost:9200 and use the default settings
var client = new elasticsearch.Client();

/*
 * Users Routes
 */

// POST create a new user
// TODO : Secure user creation to don't access form outside
exports.create = function(req, res) {
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
	    quota: body.quota,
	    username: body.username
	}
    }, function (error, response) {
	res.json(200, { status: "error", message: "Failed to create the user. " + response });
    });

    res.json(200, {
        status: "success", 
        data: {}
    });
};


// GET the list of users
exports.get = function(req, res) {
    client.search({
	index: 'users',
	type: 'user',
	q: 'username:*'
    }, function (error, response) {
	console.log(response);
	res.json(200, {
            status: "success", 
            data: response.hits
        });
	// TODO : format the data response
    });
};
