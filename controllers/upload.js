var formidable = require("formidable");
var chardet = require("chardet");
var events = require('events');
var eventEmitter = new events.EventEmitter();
var fs = require('fs');
var slugs = require("slugs");
var util = require("util");

function arrayObjectIndexOf(myArray, property) {
    if (!(myArray instanceof Array))
        return -1
    for (var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property]) return i;
    }
    return -1;
}

function formatArray(myArray, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
        for (var proper in myArray[i]) {
            myArray[i][proper] = myArray[i][proper].toLowerCase();
        }
    }
}


var generateProperJSON = function (file, sourceSlug) {
    //formatArray(databiding);
    //TODO: Vérifier que le databiding est bien formaté correctement
    //if (file instanceof Array) {
    tools.report("SLUG = " + sourceSlug);
    tools.report(util.inspect(file));
    for (var i in file) {
        var currentObject = file[i];
        var jsonObj = {};
        for (var key in currentObject) {
                jsonObj[key] = currentObject[key];
        }
        jsonObj['slugsource'] = sourceSlug;


        //TODO: LIMITER LA BULK REQUEST A 1000
        tools.report("i = " + i);
        eventEmitter.emit('line', jsonObj);
    }
    eventEmitter.emit('end');
};

var storeSourceMetaDataOnElasticSearch = function (req, db, next, slugsource, slugdataset, model) {
    var bodyArray = [];

    if (model) {
        tools.report("MODEL = " + model);
        bodyArray.push({ index: { _index: 'metadata', _type: slugdataset, _id: slugdataset } }, {model: model});
        db.bulk(bodyArray,'metadata', next, slugsource);
    }
};

var storeSourceOnElasticSearch = function (req, res, type, db, next, slugname, fields) {
    var bodyArray = [];
    eventEmitter.on('line', function (line) {
        tools.report("New line = " + JSON.stringify(line));
        bodyArray.push({ index: { _index: 'sources', _type: type } }, line);
    });
    eventEmitter.on('end', function () {
        db.bulkNoNext(bodyArray,'sources', slugname);
        storeSourceMetaDataOnElasticSearch(req, db, next, slugname, req.params.slugdataset, fields.model);
    });
};

var upload = function (req, res, next, db) {
    tools.report("Requested UPLOAD with PUBLIC key = " + req.headers.public_key);
    var form = new formidable.IncomingForm();
    var slug = slugs(req.params.slugdataset + "-" + new Date().getTime());

    form.parse(req, function(err, fields, files) {
        //console.log(fields);
        storeSourceOnElasticSearch(req, res, req.params.slugdataset, db, next, slug, fields);
        generateProperJSON(fields.source, slug);
    });
};

module.exports = upload;
