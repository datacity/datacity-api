var restify = require('restify');

function respondTest(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer({
	name: 'DataCity-API',
	version: "0.0.1"
});

server.get('/test/:name', respondTest);
server.head('/test', respondTest);

server.listen(8082, function() {
  console.log('%s listening at %s', server.name, server.url);
});