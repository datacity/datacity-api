var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client();
var events = require('events');
var eventEmitter = new events.EventEmitter();

var generateProperJSON = function(file, databiding, id) {
    if (file instanceof Array)
     {
         for (var i in file) {
            var jsonObj = file[i];
             for (var key in jsonObj) {
                 if (databiding[key])
                    jsonObj = renameProperty(jsonObj, key, databiding[key]);
             }
             jsonObj['idClient'] = id;
             //LIMITER LA BULK REQUEST A 1000
            eventEmitter.emit('line', jsonObj);
         }
         eventEmitter.emit('end');
     }
}

var storeSourceOnElasticSearch = function(res, type) {
    var bodyArray = [];
    eventEmitter.on('line', function(line) {
        bodyArray.push({index:  { _index: 'sources', _type: type} }, line);
    });
    eventEmitter.on('end', function() {
        client.bulk({
            body: bodyArray
            }, function (err, resp, status) {
                res.json(status, {
                    status: "success", 
                    data: resp
                });
            });
    });
}

function renameProperty(obj, oldName, newName) {
    if (obj.hasOwnProperty(oldName)) {
        obj[newName] = obj[oldName];
        delete obj[oldName];
    }
    return obj;
};

exports.post = function(req, res) {
    // TESTER LA SECURITE AU NIVEAU DE LA CLE PUBLIQUE
    // TESTER LE CONTENU ET LE TYPE DU FICHIER EN ENTREE
    // ENLEVER TOUT SCRIPT QUI POURRAIT ETRE PRESENT DANS LE JSON
    console.log("on rentre ici ");
    if (!req.body.jsonData || !req.body.databiding || !req.body.publickey) {
        req.json("505", {
            status: "error"
        });
        return;
    }
    storeSourceOnElasticSearch(res, req.body.category);
    generateProperJSON(req.body.jsonData, req.body.databiding, req.body.publickey);
};

exports.get = function(req, res) {
    if (!req.query.category || !req.query.publickey) {
         res.json("505", {
            status: "error"
        });
        return;
    }
    var idClient = 'idClient:' + req.query.publickey;
    client.search({
        index: 'sources',
        type: req.query.category,
        q: idClient
    }, function(error, response, status) {
            res.json(status, {
                status: "success", 
                data: response
        });
    });
};

exports.getModel = function(req, res) {
    client.indices.getMapping({
        index: 'sources'
    }, function(error, response, status) {
        console.log(response.sources);
        if (!req.query || !req.query.category || !response 
            || !response.sources || !response.sources[req.query.category] 
            || !response.sources[req.query.category].properties) {
                res.json(505, {
                    status: "error"
                });
            return;
        }
        var categoryMapping = Object.keys(response.sources[req.query.category].properties);
        res.json(200, {
            status: "success", 
            data: categoryMapping
        });
    });
}