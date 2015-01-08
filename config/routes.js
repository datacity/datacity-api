var parser = require("../controllers/parse");
var upload = require("../controllers/upload");
var download = require("../controllers/download");
var remove = require("../controllers/remove");

module.exports = function(server, db) {
    //POST - Parse (uploading sources)
    server.post({
        path: '/parse'
        , version: '1.0.0'
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
        path: '/:slugdataset'
        , params: {
            slugdataset: 'string',
        }
        , version: '1.0.0'
    }, function(req, res) {
        upload(req, res, function(err, data) {
            if (err) {
                res.json(200, {
                    status: "error",
                    data: err
                });
                console.log("! Upload error !");
            }
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

    //Download a file
    server.get({
        path: '/:slugdataset/download'
        , params: {
            slugdataset: 'string'
        }
        , version: '1.0.0'
    }, function(req, res) {
        download(req, res, function(err, data) {
            if (err) {
                res.json(200, {
                    status: "error",
                    data: err
                });
                console.log("! Download error !");
            }
            else if (data != undefined) {
                console.log("Download success. Responding...");
                res.json(200, {
                    status: "success",
                    data: data
                });
                console.log("Response sent !");
            }
        }, db);
    });

    //DELETE
    server.del({
        path: '/:slugdataset'
        , params: {
            slugdataset: 'string'
        }
        , version: '1.0.0'
    }, function(req, res) {
        remove(req, res, function(err, data) {
            if (err) {
                res.json(200, {
                    status: "error",
                    data: err
                });
                console.log("! Delete error !");
            }
            else if (data != undefined) {
                console.log("Delete succeed. Responding...");
                res.json(200, {
                    status: "success",
                    data: data
                });
                console.log("Response sent !");
            }
        }, db);
    });
};