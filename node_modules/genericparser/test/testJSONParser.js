var GenericParser = require("../index.js");
var fs = require("fs");


describe("JSON parser",function(done){
    this.timeout(5000);
    it ("Should test .json file",function(done){
        var gp = GenericParser("json");
         gp.parse(__dirname + "/files/input/JSON_TelephonePublic.json", false, function(result, index) {
             var stream = fs.createWriteStream(__dirname+"/../test/files/output/JSON_TelephonePublicParse.json");
                 stream.write(JSON.stringify(result));
                 done();
        });
    });
    it ("Should test .json file",function(done){
         GenericParser("json").parse(__dirname + "/files/input/JSON_test2.json", false, function(result, index) {
             var stream = fs.createWriteStream(__dirname+"/../test/files/output/JSON_test2Parse.json");
                 stream.write(JSON.stringify(result));
                 done();
        });
    
    });
});
