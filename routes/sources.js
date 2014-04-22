var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client();
var events = require('events');
var eventEmitter = new events.EventEmitter();

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

var generateProperJSON = function (file, databiding, id, sourceName) {
	//formatArray(databiding);
	//TODO: Vérifier que le databiding est bien formaté correctement
	if (file instanceof Array) {
		for (var i in file) {
			var currentObject = file[i];
			var jsonObj = {};
			for (var key in currentObject) {
				var indexObject = arrayObjectIndexOf(databiding, key);
				if (indexObject != -1)
					jsonObj[databiding[indexObject][key]] = currentObject[key];
			}
			jsonObj['sourceName'] = sourceName;

			//TODO: LIMITER LA BULK REQUEST A 1000
			eventEmitter.emit('line', jsonObj);
		}
		eventEmitter.emit('end');
	}
}

var storeSourceOnElasticSearch = function (req, res, type) {
	var bodyArray = [];
	eventEmitter.on('line', function (line) {
		bodyArray.push({ index: { _index: 'sources', _type: type } }, line);
	});
	eventEmitter.on('end', function () {
		client.bulk({
			body: bodyArray,
			refresh: true
		}, function (err, resp, status) {
				res.json(status, {
					status: "success",
					message: "from: " + req.url + ": You uploaded your source with success!"
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

exports.post = function (req, res) {
	// TESTER LA SECURITE AU NIVEAU DE LA CLE PUBLIQUE
	// TESTER LE CONTENU ET LE TYPE DU FICHIER EN ENTREE
	// ENLEVER TOUT SCRIPT QUI POURRAIT ETRE PRESENT DANS LE JSON
	if (!req.body || !req.body.jsonData || !req.body.databiding || !req.params.name) {
		res.json(200, {
			status: "error",
			message: "from: " + req.url + ": Wrong parameters. You need to enter valid jsonData or a valid databiding"
		});
		return;
	}
	storeSourceOnElasticSearch(req, res, req.params.category);
	generateProperJSON(req.body.jsonData, req.body.databiding, req.params.id, req.params.name);
};

exports.get = function (req, res) {
	if (!req.params.name) {
		res.json(200, {
			status: "error",
			message: "from: " + req.url + ": You need to enter a valid category or a valid publickey"
		});
		return;
	}
	var sourceName = 'sourceName:' + req.params.name;
	client.search({
		index: 'sources',
		size: '1000',
		q: sourceName
	}, function (error, response, status) {
			res.json(status, {
				status: "success",
				data: response.hits.hits,
				message: "from: " + req.url + ": Source downloaded!"
			});
		});
};

exports.getModel = function (req, res) {
	client.indices.getMapping({
		index: 'sources'
	}, function (error, response, status) {
			var category = req.params.category;
			console.log(response.sources[category]);

			if (!category || !response || !response.sources
				|| !response.sources.mappings || !response.sources.mappings[category]
				|| !response.sources.mappings[category].properties) {
				res.json(200, {
					status: "error",
					message: "from: " + req.url + ": No mapping available. Maybe it's because there is no source uploaded in elasticsearch ?"
				});
				return;
			}
			var categoryMapping = Object.keys(response.sources[category].properties);
			res.json(200, {
				status: "success",
				data: categoryMapping,
				message: "from: " + req.url + ": Mapping sended"
			});
		});
}