var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client();
var events = require('events');
var eventEmitter = new events.EventEmitter();

function arrayObjectIndexOf(myArray, property) {
    if (!(myArray instanceof Array))
        return -1
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property]) return i;
    }
    return -1;
}

function formatArray(myArray, property) {
     for(var i = 0, len = myArray.length; i < len; i++) {
         for (var proper in myArray[i]) {
             myArray[i][proper] = myArray[i][proper].toLowerCase();
         }
    }
}

var generateProperJSON = function(file, databiding, id) {
    formatArray(databiding);
    //TODO: Vérifier que le databiding est bien formaté correctement
    if (file instanceof Array)
     {
         for (var i in file) {
            var jsonObj = file[i];
             for (var key in jsonObj) {
                 var indexObject = arrayObjectIndexOf(databiding, key);
                 if (indexObject != -1)
                    jsonObj = renameProperty(jsonObj, key, databiding[indexObject][key]);
             }
             jsonObj['publicKey'] = id;
             
             //TODO: LIMITER LA BULK REQUEST A 1000
            eventEmitter.emit('line', jsonObj);
         }
         eventEmitter.emit('end');
     }
}

var storeSourceOnElasticSearch = function(res, type) {
    var bodyArray = [];
    eventEmitter.on('line', function(line) {
        //console.log(line);
        bodyArray.push({index:  { _index: 'sources', _type: type} }, line);
    });
    eventEmitter.on('end', function() {
        client.bulk({
            body: bodyArray
            }, function (err, resp, status) {
                res.json(status, {
                    status: "success", 
                    data: "Vous avez uploadé avec succès votre source!"
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
    if (!req.body.jsonData || !req.body.databiding) {
        req.json(500, {
            status: "error"
        });
        return;
    }
    storeSourceOnElasticSearch(res, req.params.category);
    generateProperJSON(req.body.jsonData, req.body.databiding, req.params.id);
};

exports.get = function(req, res) {
    if (!req.query.category || !req.query.publickey) {
         res.json(500, {
            status: "error"
        });
        return;
    }
    var idClient = 'publicKey:' + req.query.publickey;
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