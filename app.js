var express = require('express');

var sage = require("sage");
var esi = sage('http://localhost:9200/batiment');

var est = esi.type('service-public');
var app = express();
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/', function (req, res) {
    est.post({
        "test" : "1",
        "test2": "2"
        }, function(err, result) {
            console.log(result);
        });
    res.send("hello world !");
});

app.listen(process.env.PORT, function () {
    console.log('Vous avez correctement cree nouveaux serveur!!!');
});




