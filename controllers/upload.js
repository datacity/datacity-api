var formidable = require("formidable");
var chardet = require("chardet");
var events = require('events');
var eventEmitter = new events.EventEmitter();
var fs = require('fs');

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
        console.log("SLUG = " + sourceSlug);
        for (var i in file) {
            var currentObject = file[i];
            var jsonObj = {};
            for (var key in currentObject) {
                    jsonObj[key] = currentObject[key];
            }
            jsonObj['sourceSlug'] = sourceSlug;

            //TODO: LIMITER LA BULK REQUEST A 1000
            eventEmitter.emit('line', jsonObj);
        }
        eventEmitter.emit('end');
    //}
}

var storeSourceOnElasticSearch = function (req, res, type, db, next) {
    var bodyArray = [];
    eventEmitter.on('line', function (line) {
        //console.log("New line = " + JSON.stringify(line));
        bodyArray.push({ index: { _index: 'sources', _type: type } }, line);
    });
    eventEmitter.on('end', function () {
        //console.log(bodyArray);
        db.bulk(bodyArray,'sources', type, next);
    });
}

var upload2 = function (req, res, next, db) {
    console.log("Requested UPLOAD with PUBLIC key = " + req.headers.public_key);
    var form = new formidable.IncomingForm();
    var file;
    form.on('file', function (field, fileForm) {
        file = {
            name: fileForm.name,
            path: fileForm.path,
            uploadedDate: new Date(),
            lastModifiedDate: fileForm.lastModifiedDate,
            type: fileForm.type,
            size: fileForm.size,
            encoding: chardet.detectFileSync(fileForm.path),
            publicKey: req.headers.public_key
        };
        console.log("New file detected: " + fileForm.name);
    });
    form.on('end', function () {
        db.bulk(file, next);
    });
    form.on('error', function (err) {
        return next("from: " + req.url + " : An error occured on the file upload : " + err, null);// <== ICI A GARDE Et VIRER EN DeSSOUS, voir comment retourner erreur a la place du null
    });
    form.parse(req);
    return next();
}

var upload = function (req, res, next, db) {
    console.log("Requested UPLOAD2 with PUBLIC key = " + req.headers.public_key);
    var form = new formidable.IncomingForm();
    var file;
    form.on('file', function (field, fileForm) {
        file = {
            name: fileForm.name,
            slug: req.params.slugsource,
            path: fileForm.path,
            uploadedDate: new Date(),
            lastModifiedDate: fileForm.lastModifiedDate,
            type: fileForm.type,
            size: fileForm.size,
            encoding: chardet.detectFileSync(fileForm.path),
            publicKey: req.headers.public_key
        };
        console.log("New file detected: " + fileForm.name);
    });
    form.on('end', function () {
        storeSourceOnElasticSearch(req, res, "source", db, next);
        fs.readFile(file.path, function (err, jsonData) {
          if (err) {throw err;}
          console.log("parse = " + JSON.parse(jsonData));
          generateProperJSON(JSON.parse(jsonData), file.slug);
        });
    });
    form.on('error', function (err) {
        return next("from: " + req.url + " : An error occured on the file upload : " + err, null);// <== ICI A GARDE Et VIRER EN DeSSOUS, voir comment retourner erreur a la place du null
    });
    form.parse(req);
};

module.exports = upload;
