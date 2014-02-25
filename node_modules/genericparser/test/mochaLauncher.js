var Mocha = require('mocha');
var mocha = new Mocha().ui("exports").reporter("spec");
var passed = [];
var failed = [];

mocha.addFile(__dirname + "/testCSVParser.js");
mocha.addFile(__dirname + "/testJSONParser.js");
mocha.addFile(__dirname + "/testXMLParser.js");
mocha.run(function(){})
.on('fail', function(test){
    failed.push(test.title);
})
.on('pass', function(test){
    passed.push(test.title);
});
