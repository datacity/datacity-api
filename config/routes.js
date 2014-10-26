var parser = require("../controllers/parse");

module.exports = function(server, db) {
    //POST - Parse (uploading sources)
    server.post({
        path: '/:publicKey/parse'
        , version: '1.0.0'
        , params: {
            publicKey: 'number'
        }
    }, function(req, res) {
        parser(req, res, function(err, data) {
            if (err)
                console.log("! Parse error !");
            else if (data != undefined) {
                console.log("Parse success. Responding...");
                res.json(200, {
                     status: "success",
                     data: data
                    });
                console.log("Response sent !");
            }
        });
    });
};