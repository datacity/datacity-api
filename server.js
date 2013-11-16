var express = require('express');
var path = require('path');
var url = require('url');
var queryString = require('querystring');
var app = express();
var fs = require('fs');

app.configure(function() {
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.static(path.join(__dirname, 'public')));
	console.log(__dirname);
}).listen(8888);

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', function(req, res) {
});

app.post('/test', function(req, res) {
  fs.writeFile("files/servicePublic.json", JSON.stringify(req.body).replace("0", ""), function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
	/*fs.rename('/home/datacity-mobile/bat-publics/test.json', '/home/datacity-mobile/bat-publics/servicePublic.json', function (err) {
  if (err) throw err;
  fs.stat('/home/datacity-mobile/bat-publics/servicePublic.json', function (err, stats) {
    if (err) throw err;
    console.log('stats: ' + JSON.stringify(stats));
  });*/
});
  
        /*var theUrl = url.parse( req.url );
        var queryObj = queryString.parse( theUrl.query );*/
	/*res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('_testcb(\'{"message": "Hello world!"}\')');*/
});
