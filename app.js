/**
 * Imports
 */
var restify = require('restify');
var Respectify = require('respectify');
var Elasticsearch = require('./config/elasticsearch');
var Mariadb = require('./config/mariadb');
var Middleware = require('./config/middleware');

/**
 * Inits
 */
var mariaClient = new Mariadb();
var elasticClient = new Elasticsearch();
var server = restify.createServer({
    name: 'DataCity-API',
    version: "0.0.1"
});
var middleware = new Middleware(server, mariaClient);

mariaClient.connect();
elasticClient.connect();

/**
 * Server Use functions
 */
server.use(restify.CORS({'origins': ['*']}));
server.use(function(req, res, next) {
    middleware.authenticate(req, res, next);
});

//Initialisation de respectify
var respect = new Respectify(server);

//Verification des appels aux routes selon les regles definies
server.use(respect.middleware());

//Definition des routes
require('./config/routes')(server, elasticClient);

server.listen(4567, function() {
  console.log('%s listening at %s', server.name, server.url);
});