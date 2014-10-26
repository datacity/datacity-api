var restify = require('restify');
var Respectify = require('respectify');
var elasticsearch = require('elasticsearch');
var middleware = require('./config/middleware');

// Elasticsearch database
var db = new elasticsearch.Client({
    host: 'localhost:9200'/*,
     log: 'trace'*/
});

//Init du server restify
var server = restify.createServer({
	name: 'DataCity-API',
	version: "0.0.1"
});

//Allow cross origin
server.use(restify.CORS({'origins': ['*']}));

server.use(function(req, res, next) {
    console.log("middleware server use");
    middleware(server, db);
    next();
});

// Create the respectify instance with the new server
var respect = new Respectify(server);

server.use(respect.middleware());


require('./config/routes')(server, db);

server.listen(4567, function() {
  console.log('%s listening at %s', server.name, server.url);
});