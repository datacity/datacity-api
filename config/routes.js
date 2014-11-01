var parser = require("../controllers/parse");
var upload = require("../controllers/upload");

module.exports = function(server, db) {
    //POST - Parse (uploading sources)
    server.post({
        path: '/parse'
        , version: '1.0.0'
        , params: {
            public_key: 'number'
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

    //POST - Upload (uploading sources)
    server.post({
        path: '/upload'
        , version: '1.0.0'
        , params: {
            public_key: 'number'
        }
    }, function(req, res) {
        upload(req, res, function(err, data) {
            if (err)
                console.log("! Upload error !");
            else if (data != undefined) {
                console.log("Upload success. Responding...");
                res.json(200, {
                    status: "success",
                    data: data
                });
                console.log("Response sent !");
            }
        }, db);
    });
};