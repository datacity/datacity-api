var request = require("supertest");

describe('GET Functions', function(){
  it('respond with json', function(done){
    request("http://localhost:4567")
      .get('/test')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
         console.log(res.text);
        if (err) return done(err);
        done()
      });
  })
})