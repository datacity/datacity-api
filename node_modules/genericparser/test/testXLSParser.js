var GenericParser = require("../index.js");
var fs = require("fs");

describe("XLS parser",function(done){
    this.timeout(8000);
    it ("Should test .xls file (2.2MB)",function(done){
        var gp = GenericParser("xls");
         gp.parse(__dirname + "/files/input/elections.xls", false, function(result, index) {
             var stream = fs.createWriteStream(__dirname+"/../test/files/output/elections.json");
                 stream.write(JSON.stringify(result));
                 done();
        });
    });
});
