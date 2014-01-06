var frisby = require("frisby");

frisby.globalSetup({
    request: {
        headers:{'Accept': 'application/json'}
    }    
});

frisby.create('Get simple test')
    .get('http://localhost:4567/test')
    .expectStatus(200)
    .expectJSONTypes({
        document: Boolean
    })
    .expectJSON({
        testdeep: {1: "cool"}
    })
    .expectJSONTypes({
        testdeep: Object
    })
    .expectJSON({
        testdeep: {1: "cool", 2: "pascool"}
    })
    .toss();

    
