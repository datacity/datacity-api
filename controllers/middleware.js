module.exports = function middlewareUser(req, res, next, publicKey) {
    console.log('starting middleware');

    //console.log(req.client);

    client.ping({
        // ping usually has a 100ms timeout
        requestTimeout: 1000,

        // undocumented params are appended to the query string
        hello: "elasticsearch!"
    }, function (error) {
        if (error) {
            console.trace('elasticsearch cluster is down!');
        } else {
            console.log('All is well');
        }
    });
    console.log('REQ DONE');
    client.search({
        index: 'users',
        type: 'user',
        // q: '_id:' + publicKey
        id: publicKey
    }).then(function (resp) {
        console.log(resp.hits.hits);
        if (resp.hits.hits.length == 0) { //If there is no user, let register him as anonym
            return next(new Error('user not found'));
        }
        else if (resp.hits.hits.length > 1) {
            return next(new Error('multiple users found'));
        }
        req.user = resp.hits.hits[0]["_source"];

        console.log('middleware END');

        next();
    }, function (err) {
        return next(err);
    });
};

module.exports = {
    publicKey: middlewareUser
};