var express = require('express');
var app = express();
var colors = require('colors');
var sage = require("sage");
var esi = sage('http://localhost:9200/batiment');
var fs = require('fs');
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
    app.use(express.bodyParser({ keepExtensions: true}));
    app.use(express.static(__dirname + '/public'));
});

app.use(function(req, res, next){
  if (req.is('text/*') || req.is('application/*')) {
    req.text = '';
    //req.setEncoding('utf8');
    req.on('data', function(chunk){ req.text += chunk });
    console.log(req.text);
    req.on('end', next);
  } else {
    next();
  }
});

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/*var parserFactoryInstance = new parserFactory("test.csv", "csv");
parserFactoryInstance.createParser();*/

app.post('/upload', function(req, res) {
   var ext = req.headers['content-type'].split(';')[0].split('/')[0];
    /*if (req.body.length <= 2 && req.text.length <= 2)
        return;*/
 fs.writeFile('test.xls', req.text, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});
    console.log(req.text);
  console.log(req.headers['content-type'].split(';')[0].split('/')[0]);
 /* var parserFactoryInstance = new parserFactory(req.body.length > 2 ? req.body : req.text, ext);*/
  console.log(parserFactory);
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

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
    console.log('Listening on process.env.PORT : ' + process.env.PORT);
});
