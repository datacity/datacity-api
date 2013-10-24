///<reference path='typescript-node-definitions/node.d.ts'/>
///<reference path='typescript-node-definitions/mongodb.d.ts'/>
///<reference path='typescript-node-definitions/express.d.ts'/>

var express = require('express');
ElasticSearchClient = require('elastisearchclient');

var serverOptions = {
    host: 'localhost',
    port: 9200,
    pathPrefix: 'optional pathPrefix',
    secure: true || false
};

var app = express.createServer();
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var qryObj = { "query": { "match_all": {} } };
var elasticSearchClient = new ElasticSearchClient(serverOptions);

app.get('/', function (req, res) {
    /* elasticSearchClient.search('batiment', 'servicepublic', qryObj)
    .on('data', function (data) {
    console.log(JSON.parse(data))
    })
    .on('done', function () {
    //always returns 0 right now
    })
    .on('error', function (error) {
    console.log(error)
    })
    .exec()*/
});

app.listen(3000, function () {
    console.log('Vous avez correctement cree nouveaux serveur!!!');
});

