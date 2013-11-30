var express = require('express');
var app = express();
var colors = require('colors');
var sage = require("sage");
var esi = sage('http://localhost:9200/batiment');
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var parserFactory = require('generic-parser');

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

app.post('/upload', function(req, res) {
    var fileName = req.files.file.name.split('.');
    var name = fileName[0];
    var type = fileName[fileName.length - 1];
 
    console.log("voici le nom du file : " + name);
    console.log("voici le type du file: " + type);
    console.log("voici l'upload du file: " + req.files.file.path);
 
    var is = fs.createReadStream(req.files.file.path);
    var os = new stream();
    var rl = readline.createInterface(is, os);
    fs.writeFile(req.files.file.name, '', function (err) {
    if (err) throw err;
        console.log('It\'s saved!');
    });
    
    rl.on('line', function(line) {
        fs.appendFile(req.files.file.name, line, function (err) {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
        });
    });

    rl.on('close', function() {
        // do something on finish here
    });
    
    
    /*var data;
    is.on('data', function(sdata) {
        console.log("on rentre dans on : " + sdata);
        data += sdata;
    });

    is.on('end', function() {
        console.log(data);
    });*/

    
});


/**
 * Exemple d'un rajout de document dans l'index d'elasticsearch
 */
app.get('/', function (req, res) {
    est.post({
        "Column1" : "c1FirstRow",
        "Column2": "c2FirstRow"
        }, function(err, result) {
            if (result.error)
                res.send('<b>Error on post : ' + err + '</b>');
            else
                res.send('<b>Document Sucessfully created!' + result + '</b>');
        });
});

app.listen(process.env.PORT, function () {
    console.log('Listening on process.env.PORT : '.blue + process.env.PORT);
});
