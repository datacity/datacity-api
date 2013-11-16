var express = require('express');
var app = express();
var colors = require('colors');
var sage = require("sage");
var esi = sage('http://localhost:9200/batiment');

esi.create(function(err, result) {
    if (result.error)
        console.log('Index was already created'.red)
    else
        console.log(result);
});

var est = esi.type('service-public');

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
        "Column1" : "c1FirstRow",
        "Column2": "c2FirstRow"
        }, function(err, result) {
            if (result.error)
                res.send('<b>Error on post : ' + err + '</b>');
            else
                res.send('<b>Document Sucessfully created!' + result + '</b>');
        });
});

app.listen(process.env.PORT, function () {
    console.log('Listening on process.env.PORT : ' + process.env.PORT);
});
