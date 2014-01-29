var express = require('express');
var app = express();
var colors = require('colors');
var sage = require("sage");
var esi = sage('http://localhost:9200/batiment');
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var GenericParser = require('genericparser');
var rest = require('restler');

esi.create(function(err, result) {
    if (result.error)
        console.log('Index was already created'.red)
    else
        console.log(result);
});

var est = esi.type('service-public');


app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.bodyParser({uploadDir:'./tmp', keepExtensions: true}));
     app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express.static(__dirname + '/public'));
});

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/parse/file', function(req, res) {
    console.log("voici l'upload du file: " + req.files.file.path);
    console.log("nom total : " + req.files.file.name);
    
    if (!req || !req.files || !req.files.file || !req.files.file.name) {
        res.writeHead(200, {'Content-Type': "application/json"});
        res.end("{'success' : false}");
        return;
    }
    var fileTab = req.files.file.name.split(".");
    var type = fileTab[fileTab.length-1];
    GenericParser(type).parse(req.files.file.path, false, function(result) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));
    });
});

app.post("/testpost", function (req, res) {
  
  rest.post('http://localhost:4567/upload', {
    multipart: true,
    data: {
        "file": rest.file('./test/files/servicePublic.json', null, 153469, null, 'text/csv')
    }
    }).on('complete', function(data, response) {
        res.writeHead(response.statusCode, {'Content-Type': 'text/plain'});
        res.end("Ca a fonctionné");
    });
});

/**
 * Exemple d'un rajout de document dans l'index d'elasticsearch
 */
app.get('/test', function (req, res) {
    console.log("on fait une requête sur test!!!");
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end('{"document": true, "data": "success", "testdeep": {"1": "cool", "2": "pascool"}}');
    /*est.post({
        "Column1" : "c1FirstRow",
        "Column2": "c2FirstRow"
        }, function(err, result) {
            if (result.error)
                res.send('<b>Error on post : ' + err + '</b>');
            else
                res.send('<b>Document Sucessfully created!' + result + '</b>');
        });*/
});

app.listen(process.env.PORT, function () {
    console.log('Listening on process.env.PORT : '.blue + process.env.PORT);
});
