var restify = require('restify');
var Respectify = require('respectify');
var inspect = require('util').inspect;
var elasticsearch = require('elasticsearch');
var mariadb = require('./config/mariadb');
var middleware = require('./config/middleware');

// Maria database
var mariaClient = new mariadb();
mariaClient.connect();


// Elasticsearch database
var elasticDB = new elasticsearch.Client({
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
    middleware(server, elasticDB);
    next();
});

// Create the respectify instance with the new server
var respect = new Respectify(server);

server.use(respect.middleware());


require('./config/routes')(server, elasticDB);

server.listen(4567, function() {
  console.log('%s listening at %s', server.name, server.url);
});