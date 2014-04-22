
// Module dependencies

var express = require('express');
var routes = require('./routes');
var files = require('./routes/files');
var users = require('./routes/users');
var sources = require('./routes/sources');
var middleware = require('./middleware/middleware');
var http = require('http');
var path = require('path');
var fs = require('fs');

var uploadDir = "./uploads/";


var app = express();

// all environments
app.set('port', process.env.PORT || 4567);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.limit(100000000)); // TODO : replace this deprecated function
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(middleware.errorHandler);
app.use(express.errorHandler({dumpExceptions:true, showStack:true})); // TODO : check the right way for the event handler

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// WARNING : seems cause issues in the header
app.all('*', function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
res.header("Access-Control-Allow-Credentials", "true");
res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
next();
});

/*************************************************************************/

// Create upload directory for the uploaded files
fs.mkdir(uploadDir, function(error) {
    if (error) {
        console.log("Unable to create the upload directory : " + error);
    }
});

app.get('/', routes.index);
// TEST ROUTES
app.get('/testUpload', routes.testUpload);

// FILES
app.get('/file/:path', middleware.check, files.get);
app.get('/file', files.list); // list all the files

// USERS
app.get('/user/:publicKey/parse/:path', middleware.check, files.parse);
app.post('/user/:publicKey/upload', middleware.check, files.post);
app.get('/user/:publicKey/files', middleware.check, middleware.quota, files.user);
app.delete('/user/:publicKey/file/:path', middleware.check, files.delete);
app.get('/user', users.get);
app.post('/user', users.createUser);
app.delete('/user/:publicKey', middleware.check, users.delete);

// SOURCES
app.post('/user/:id/source/:category/:name/upload', sources.post);
app.get('/source/:category/model', sources.getModel);
app.get('/source/:name/download', sources.get);

// ALL
app.get('/*', function(req, res, next) {
	next({type: "error", message:"Unknown route [" + req.url + "]."});
});

/*************************************************************************/

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
 
