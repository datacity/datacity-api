/*
 * Module dependencies
 */
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');

/*
 * Elasticsearch database
 */
var db = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'trace'
});

var routes = require('./routes/index');
var users = require('./routes/users');
var files = require('./routes/files');
//var sources = require('./routes/sources');
//var middleware = require('./middleware/middleware');


var app = express();

/*
 * Configuration Express
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

/*
 * Make Elasticsearch accessible to the routers
 */
app.use(function(req, res, next){
    req.db = db;
    next();
});

/*
 * Routes
 */
app.use('/', routes);
app.use('/users', users);


/*
 * Errors
 */

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;















/*
// all environments
app.set('port', process.env.PORT || 4567);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.limit(100000000)); // TODO : replace this deprecated function
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//app.use(middleware.errorHandler);
//app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); // TODO : check the right way for the event handler
*/


/*
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}
*/

/*
// WARNING : seems cause issues in the header
app.all('*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
	next();
});
*/

/*************************************************************************/

// Create upload directory for the uploaded files
/*
fs.exists(uploadDir, function (exists) {
	if (!exists) {
		fs.mkdir(uploadDir, function (error) {
			if (error) {
				console.log("Unable to create the upload directory : " + error);
			}
		});
	}
});

app.get('/', routes.index);
*/


/*
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
app.delete('/user/:publicKey', middleware.check, users.remove);

// SOURCES
app.post('/user/:id/source/:category/:name/upload', sources.post);
app.get('/source/:category/model', sources.getModel);
app.get('/source/:name/download', sources.get);

// ALL
app.get('/*', function (req, res, next) {
	next({ type: "error", message: "Unknown route [" + req.url + "]." });
});

/*************************************************************************/

/*
http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});

*/


// use this instead ./bin/www default (express4) launch
var debug = require('debug')('datacity-api');
app.set('port', process.env.PORT || 4567);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});