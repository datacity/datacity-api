var request = require("supertest");

describe('POST Functions', function(){
  
  it('send and parse a json file', function(done){
    request("http://localhost:4567")
      .post('/parse/file')
      .attach("file", __dirname+"/../files/JSON_test.json")
      .set('Accept', 'application/json')
      .end(function(err, res){
         console.log(res.text);
        if (err) return done(err);
        done()
      });
  })
  
  it('send and parse a json file', function(done){
    request("http://localhost:4567")
      .post('/parse/file')
      .attach("file", __dirname+"/../files/JSON_test2.json")
      .set('Accept', 'application/json')
      .end(function(err, res){
         console.log(res.text);
        if (err) return done(err);
        done()
      });
  })
  
   it('send and parse a csv file', function(done){
    request("http://localhost:4567")
      .post('/parse/file')
      .attach("file", __dirname+"/../files/OSM_MTP_Pharmacie.csv")
      .set('Accept', 'application/json')
      .end(function(err, res){
         console.log(res.text);
        if (err) return done(err);
        done()
      });
  })
  
   it('send and parse a xml file', function(done){
    request("http://localhost:4567")
      .post('/parse/file')
      .attach("file", __dirname+"/../files/VilleMTP_MTP_ZATAntigone_2011.xml")
      .set('Accept', 'application/json')
      .end(function(err, res){
        //S'il y a une réponse elle sera dans text au format jsons stringifié
         console.log(res.text);
        if (err) return done(err);
        done()
      });
  })
  
  
})