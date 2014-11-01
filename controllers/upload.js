var formidable = require("formidable");
var util = require('util');
var genericParser = require("genericparser");
var events = require('events');
var eventEmitter = new events.EventEmitter();
var fs = require('fs');

var upload = function (req, res, next, db) {
    console.log("Requested UPLOAD with PUBLIC key = " + req.headers.public_key);
    var bodyArray = [];
    eventEmitter.on('line', function (line) {
        console.log("eventEmitter ON line");
        bodyArray.push({ index: { _index: 'sources', _type: 'json'} }, line);
    });
    eventEmitter.on('end', function () {
        console.log("eventEmitter ON end");
        db.bulk({
            body: bodyArray,
            refresh: true
        }, function (err, resp, status) {
            res.json(status, {
                status: "success",
                message: "from: " + req.url + ": You uploaded your source with success!"
            });
        });
    });
    return next(null, 'OK');
}

module.exports = upload;