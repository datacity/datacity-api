
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var files = require('./routes/files');
var users = require('./routes/users');
var sources = require('./routes/sources');
var http = require('http');
var path = require('path');


var app = express();

// all environments
app.set('port', process.env.PORT || 4567);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
  res.header("Access-Control-Allow-Credentials', true");
  res.header("Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS");
  next();
});

app.get('/', routes.index);

// TEST ROUTES
app.get('/testUpload', routes.testUpload);

// FILES (origin file only !! not parsed)
app.get('/file/:id', files.get);
app.get('/file', files.list); // list all the files
// TODO : Delete files

// USERS
//app.post('/user/:id/upload', users.create);
app.get('/user/:id/parse/:path', files.parse); // Parse the file with generic parse module
app.post('/user/:id/upload', files.post); // the id is the public key
app.get('/user/:id/files', files.user); // the id is the public key
app.get('/user', users.get);
app.post('/user', users.create);
app.delete('/user/:id', users.delete); // the id is the elasticsearch id

// SOURCES
app.post('/source/upload', sources.post);
app.get('/source/model', sources.getModel);
app.get('/source/download', sources.get);


// TODO : Routes to make
//app.get('/user/:id/files', users.files);
//app.get('/user/:id', users.get);
// Categories
// app.get('/category', categories.getCategories);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
