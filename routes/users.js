var elasticsearch = require('elasticsearch');
// see http://www.elasticsearch.org/blog/client-for-node-js-and-the-browser/

// Connect to localhost:9200 and use the default settings
var client = new elasticsearch.Client();

/*
 * Users Routes
 */

// POST create a new user
// TODO : Secure user creation to don't access form outside
exports.create = function(req, res) {
  var body = req.body;
  console.log(req.body);

  if (!body.publicKey || !body.privateKey || !body.quota || !body.username) {
   res.json(200, { status: "error", message: "Invalid request" });
 }

 client.create({
   index: 'users',
   type: 'user',
   body: {
     publicKey: body.publicKey,
     privateKey: body.privateKey,
     creation: new Date(),
     quota: body.quota,
     username: body.username
   }
 }).then(function (resp) {
    res.json(200, {
  status: "success",
  data: "user created"
});
   // res.json(200, { status: "error", message: "Failed to create the user. " + response });
 }, function(err) {
  res.json(200, {
    status: "error", 
    data: err.message
  });
 });
};

// GET the list of users
exports.get = function(req, res) {
  client.search({
   index: 'users',
   type: 'user',
   q: 'username:*'
 }).then(function (resp) {
  var list = [];
  for (var user in resp.hits.hits) {
    list.push({
      id: resp.hits.hits[user]["_id"],
      publicKey: resp.hits.hits[user]["_source"]["publicKey"],
      username: resp.hits.hits[user]["_source"]["username"],
      quota: resp.hits.hits[user]["_source"]["quota"],
      creation: resp.hits.hits[user]["_source"]["creation"]
    });
  }
  res.json(200, {
    status: "success", 
    data: list
  });
}, function(err) {
  res.json(200, {
    status: "error", 
    data: "from: " + req.url + ": " + err.message
  });
});
};

// DELETE the user
exports.delete = function(req, res) {
  var id = req.params.id;
  client.delete({
   index: 'users',
   type: 'user',
   id: id
 }).then(function (resp) {
  
  res.json(200, {
    status: "success", 
    data: resp
  });
}, function(err) {

  res.json(200, {
    status: "error", 
    data: err.message
  });
});
};
