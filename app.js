var restify = require('restify');
var Respectify = require('respectify');
var elasticsearch = require('elasticsearch');

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

// Create the respectify instance with the new server
var respect = new Respectify(server);

require('./config/routes')(server, db);

//Allow cross origin
server.use(restify.CORS({'origins': ['*']}));
server.use(respect.middleware);

server.listen(4567, function() {
  console.log('%s listening at %s', server.name, server.url);
});