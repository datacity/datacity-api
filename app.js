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

function unknownMethodHandler(req, res) {
  if (req.method.toLowerCase() === 'options') {
    var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'public_key', 'private_key'];

    if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
    res.header('Access-Control-Allow-Methods', res.methods.join(', '));
    res.header('Access-Control-Allow-Origin', req.headers.origin);

    return res.send(204);
  }
  else
    return res.send(new restify.MethodNotAllowedError());
}

server.on('MethodNotAllowed', unknownMethodHandler);

/**
 * Server Use functions
 */
server
	.use(restify.CORS({'origins': ['*']}))
	.use(
          function crossOrigin(req,res,next){
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            return next();
          }
    )
    .use(function(req, res, next) {
            middleware.authenticate(req, res, next);
        })
    .use(restify.queryParser());

//Initialisation de respectify
var respect = new Respectify(server);

//Verification des appels aux routes selon les regles definies
server.use(respect.middleware());
// server.use(restify.fullResponse())
//server.use(restify.bodyParser());

//Definition des routes
require('./config/routes')(server, elasticClient);

server.listen(4567, function() {
  console.log('%s listening at %s', server.name, server.url);
});