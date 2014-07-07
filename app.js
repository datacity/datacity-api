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
	host: 'localhost:9200'/*,
	log: 'trace'*/
});

var routes = require('./routes/index');
var users = require('./routes/users');
var files = require('./routes/files');
var site = require('./routes/site');
//var sources = require('./routes/sources');


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
 * Allow cross origin
 */
app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.send(200);
	} else {
		next();
	}
});

/*
 * Routes
 */
app.use('/', routes);
app.use('/users', users);
app.use('/files', files);
app.use('/site', site);


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
        res.json({
			status: "error",
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
		status: "error",
        message: err.message,
        error: {}
    });
});

module.exports = app;


// use this instead ./bin/www default (express4) launch
var debug = require('debug')('datacity-api');
app.set('port', process.env.PORT || 4567);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});