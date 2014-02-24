var GenericParser = require("../index.js");
var fs = require("fs");


describe("XML parser",function(done){
    this.timeout(5000);
    it ("Should test .xml file",function(done){
         GenericParser("xml").parse(__dirname + "/files/input/VilleMTP_MTP_ZATAntigone_2011.xml", false, function(result, index) {
             var stream = fs.createWriteStream(__dirname+"/../test/files/output/VilleMTP_MTP_ZATAntigone_2011.json");
                 stream.write(JSON.stringify(result));
                 done();
        });
    });
    it ("Should test .xml file",function(done){
         GenericParser("xml").parse(__dirname + "/files/input/24440040400129_NM_NM_00010_LISTE_HORAIRES_PKGS_PUB_NM_STBL.xml", false, function(result, index) {
             var stream = fs.createWriteStream(__dirname+"/../test/files/output/24440040400129_NM_NM_00010_LISTE_HORAIRES_PKGS_PUB_NM_STBL.json");
                 stream.write(JSON.stringify(result));
                 done();
        });
    });
});
