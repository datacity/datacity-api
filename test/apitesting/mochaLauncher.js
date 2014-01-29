var Mocha = require('mocha');
var mocha = new Mocha().ui("exports").reporter("spec");
var passed = [];
var failed = [];

mocha.addFile(__dirname + "/getTest.js");
mocha.addFile(__dirname + "/postTest.js");

mocha.run(function(){})
.on('fail', function(test){
    failed.push(test.title);
})
.on('pass', function(test){
    passed.push(test.title);
});
