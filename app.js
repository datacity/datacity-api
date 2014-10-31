var restify = require('restify');
var Respectify = require('respectify');
var elasticsearch = require('./config/elasticsearch');
var mariadb = require('./config/mariadb');
var middleware = require('./config/middleware');

// Maria database
var mariaClient = new mariadb();
mariaClient.connect();

//ElasticSearch database
var elasticClient = new elasticsearch();
elasticClient.connect();

//Init du server restify
var server = restify.createServer({
	name: 'DataCity-API',
	version: "0.0.1"
});

//Allow cross origin
server.use(restify.CORS({'origins': ['*']}));

//Middleware server use
server.use(function(req, res, next) {
    middleware(server, elasticClient);
    next();
});

// Create the respectify instance with the new server
var respect = new Respectify(server);

//Verification des appels aux routes selon les regles definies
server.use(respect.middleware());

//Definition des routes
require('./config/routes')(server, elasticClient);

server.listen(4567, function() {
  console.log('%s listening at %s', server.name, server.url);
});