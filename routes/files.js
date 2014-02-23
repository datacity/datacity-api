var formidable = require('formidable');
var elasticsearch = require('elasticsearch');

var genericParser = require('genericparser');
var utils = require('./utils');
var fs = require('fs');

var uploadDir = "./uploads/";

// Connect to localhost:9200 and use the default settings
var client = new elasticsearch.Client();

/*
 * Files Routes
 */
// POST upload multiple user file
exports.post = function(req, res) {
  var id = req.params.id;
  if (!id) {
   res.json(200, { status: "error", message: "from: " + req.url + " : invalid publicKey in the request" });	
   return;
 }
    // TODO : check here id the user exists and get the elasticsearch user id

    // utils.checkUserExists(id);

    var form = new formidable.IncomingForm();
    var files = [];
    form.uploadDir = uploadDir;
    form.on('file', function(field, fileForm) {
      var file = {
        name: fileForm.name,
        path: fileForm.path.replace(/^.*(\\|\/|\:)/, ''),
        uploadedDate: new Date(),
        lastModifiedDate: fileForm.lastModifiedDate,
        type: fileForm.type,
        size: fileForm.size,
        publicKey: id // TODO : put real user ID -> elasticsearch
      };
     client.create({
       index: 'files',
       type: 'file',
       body: file
    }).then(function(resp) {
        res.json(200, { status: "error", message: "from: " + req.url + " : Failed to save the file \"" + file.name + "\" . " + resp});
   }, function(err) {

   });
     files.push(file);
   });
    form.on('end', function() {
     res.json(200, {
      status: "success", 
      data: {
        "files": files
      },
      message: "from: " + req.url + ": file upload successfully!"
    });
   });
    form.on('error', function(err) {
     res.json(200, { 
         status: "error", 
         message: "from: " + req.url + " : An error occured on the file upload : " + err
        });
   });
    form.parse(req);
  };
  
  // GET The File from the path 
  exports.parse = function(req, res) {
      if (!req.params || !req.params.path || !req.params.id) {
          res.json(200, {
              status: "error", 
              message: "from: " + req.url + " : Send path and public key please"
          });
          return;
      }
      var path = req.params.path;
      var id = req.params.id;
      var dirName = uploadDir + path;

      fs.exists(dirName, function(exists) {
          if (exists) {
              var typeTab = path.split('.');
              var type = typeTab[typeTab.length - 1].toLowerCase();
              genericParser(type).on("error", function(error) {
                  res.json(200, {
                      status: "error", 
                      message: "from: " + req.url + " : " + error.message
                  });
              });
              genericParser(type).parse(dirName, false, function(result, index) {
                  if (result)
                     res.json(200, {
                         status: "success",
                         data: result, 
                         message: "from: " + req.url + ": file parsed successfully!"
                     });
              });
          }
      });
  }

  exports.get = function(req, res) {
    var id = req.params.id;
    var filePath = uploadDir + id;

    fs.exists(filePath, function(exists) {
     if (exists) {
       client.search({
        index: 'files',
        type: 'file',
        q: 'path:"' + id + '"' 
      }, function (error, response) {
        var filename = response.hits.hits[0]["_source"]["name"];
        res.download(filePath, filename);
      });
     } else {
       res.statusCode = 404;
       return res.send('Error 404: No file found');
     }
   });
  };


  exports.list = function(req, res) {
    client.search({
     index: 'files',
     type: 'file',
     q: 'path:*'
   }).then(function (resp) {
    var list = [];
    for (var file in resp.hits.hits) {
      list.push({
        name: resp.hits.hits[file]["_source"]["name"],
        path: resp.hits.hits[file]["_source"]["path"],
        uploadedDate: resp.hits.hits[file]["_source"]["uploadedDate"],
        lastModifiedDate: resp.hits.hits[file]["_source"]["lastModifiedDate"],
        type: resp.hits.hits[file]["_source"]["type"],
        size: resp.hits.hits[file]["_source"]["size"],
        publicKey: resp.hits.hits[file]["_source"]["publicKey"]
      });
    }
    res.json(200, {
      status: "success", 
      data: list,
       message: "from: " + req.url
    });
  }, function(err) {
    res.json(200, {
      status: "error", 
      message: err.message
    });
  });
 };

exports.user = function(req, res) {
  var id = req.params.id;
  client.search({
   index: 'files',
   type: 'file',
   q: 'publicKey:' + id
 }).then(function (resp) {
  var list = [];
  for (var file in resp.hits.hits) {
    list.push({
      name: resp.hits.hits[file]["_source"]["name"],
      path: resp.hits.hits[file]["_source"]["path"],
      uploadedDate: resp.hits.hits[file]["_source"]["uploadedDate"],
      lastModifiedDate: resp.hits.hits[file]["_source"]["lastModifiedDate"],
      type: resp.hits.hits[file]["_source"]["type"],
      size: resp.hits.hits[file]["_source"]["size"],
      publicKey: resp.hits.hits[file]["_source"]["publicKey"]
    });
  }
  res.json(200, {
    status: "success", 
    data: list,
    message: "from: " + req.url
  });
}, function(err) {
  res.json(200, {
    status: "error", 
    message: "from: " + req.url + ": " + err.message
  });
});
};

  exports.delete = function(req, res) {
      if (!req.params || !req.params.path || !req.params.id) {
          res.json(200, {
              status: "error", 
              message: "from: " + req.url + " : Send path and public key please"
          });
          return;
      }
      var path = req.params.path;
      var id = req.params.id;
      var dirName = uploadDir + path;

      fs.exists(dirName, function(exists) {
          if (exists) {
              client.deleteByQuery({
                 index: 'files',
                 type: 'file',
                 q: 'path:"' + path + '"'
               }).then(function (resp) {
                
                fs.unlink(dirName, function (err) {
                  if (err) throw err;
                // TODO : delete file on the file system

                  res.json(200, {
                    status: "success", 
                    data: "the file has been deleted"
                  });
                });
              }, function(err) {

                res.json(200, {
                  status: "error", 
                  data: err.message
                });
              });
          }
          else {
            res.json(200, {
                  status: "error", 
                  data: "file doesn't exist on the file system"
                });
          }
      });
  }