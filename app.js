var restify = require('restify');
var parse = require('./routes/parse');

function respondTest(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer({
	name: 'DataCity-API',
	version: "0.0.1"
});
/*
 * Allow cross origin
 */
server.use(restify.CORS({'origins': ['*']}));
/*server.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.send(200);
	} else {
		next();
	}
});*/

/*server
  .use(restify.fullResponse())
  .use(restify.bodyParser());
*/
server.post('/:publicKey/parse', parse);

server.listen(4567, function() {
  console.log('%s listening at %s', server.name, server.url);
});