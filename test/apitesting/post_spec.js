var frisby = require("frisby");

frisby.globalSetup({
    request: {
        headers:{'Accept': 'application/json'}
    }
});

frisby.create('Post File simple test')
    .post('http://localhost:4567/testpost')
    .expectStatus(200)
    .inspectBody()
    .toss();