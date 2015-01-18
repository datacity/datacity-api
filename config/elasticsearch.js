var elasticsearch = require('elasticsearch');


/**
 * Classe de connexion a la base de donnée ElasticSearch
 * @constructor
 */
function    Elasticdb() {

    this._host = 'http://127.0.0.1:9200';
    this._client = null;
}

/**
 * Instantiates client and connects to elasticsearch
 */
Elasticdb.prototype.connect = function() {
    this._client = new elasticsearch.Client({
        host: this._host,
        keepAlive: false,
        log: {
          type: 'file',
          level: 'trace',
          path: 'elasticsearch.log'
        }
    });
};

Elasticdb.prototype.bulk = function(obj, index, next, slugname) {
  this._client.bulk({
      body: obj,
      refresh: true
    }, function (err, resp, status) {
        if (err) {
          return next(err, null);
        }
        else {
          return next(null, slugname);
        }
      });
};

Elasticdb.prototype.ping = function() {
    this._client.ping({
      // ping usually has a 100ms timeout
      requestTimeout: 1000,

      // undocumented params are appended to the query string
      hello: "elasticsearch!"
    }, function (error) {
      if (error) {
        console.trace('elasticsearch cluster is down!');
      } else {
        console.log('All is well');
      }
    });
}

Elasticdb.prototype.download = function(obj, next) {
    this._client.search({
      index: 'files',
      type: 'file',
      body: {
        query: {
          match: {
            name: obj
          }
        }
      }
    }).then(function (resp) {
        var hits = resp.hits.hits;
        fs = require('fs');
        fs.readFile(hits[0]._source.path, 'utf8', function (err, data) {
          if (err) {
            return console.log(err);
          }
          next(null, data);
        });
    }, function (err) {
        console.trace(err.message);
        next(err.message, null);
    });
};

Elasticdb.prototype.getModel = function(type, source, next) {
  console.log("Search model for " + source);
  this._client.search({
    index: 'metadata',
    type: type
  }).then(function (resp) {
      var hits = resp.hits.hits;
      next(null, hits[0]["_source"]["model"]);
  }, function (err) {
      console.trace(err.message);
  });
};

Elasticdb.prototype.deleteDataset = function(slugname, next) {
  console.log("DELETE " + slugname);
  this._client.deleteByQuery({
    index: ['sources', 'metadata'],
    q: '_type: ' + slugname
  }, function (error, response) {
    console.log(response);
    console.log(error);
    next(error, response);
  });
};

Elasticdb.prototype.deleteMetadata = function(dataset, next) {

    console.log("DELETE " + dataset);
    this._client.deleteByQuery({
        index: 'metadata',
        q: '_type: ' + dataset
    }, function (error, response) {
        console.log(response);
        console.log(error);
        next(error, response);
    });
};

Elasticdb.prototype.deleteItem = function(index, type, id, next) {
  this._client.delete({
          index: index,
          type: type,
          id: id
        }, function (error, response) {
          if (response != undefined) {
            console.log(response);
            return response;
          }
          console.log(error);
          return error;
        });
};

Elasticdb.prototype.deleteSource = function(slugdataset, slugsource, next) {
  console.log("DELETE " + slugdataset + "/" + slugsource);
  var that = this;

  this._client.search({
    index: 'sources',
    type: slugdataset,
    from: 0,
    size: 1,
    body: {
      query: {
        match: {
          slugsource: slugsource
        }
      }
    }
  }).then(function (resp) {
      var hits = resp.hits.hits;
      hits.forEach(function (i) {
        that.deleteItem("sources", slugdataset, i["_id"], next);
      }); 
      that._client.search({
        index: 'sources',
        type: slugdataset,
        from: 0,
        size: resp.hits.total,
        body: {
          query: {
            match: {
              slugsource: slugsource
            }
          }
        }
      }).then(function (resp) {
          var hits = resp.hits.hits;
          hits.forEach(function (i) {
            that.deleteItem("sources", slugdataset, i["_id"], next);
          }); 
          next(null, hits[0]["_source"]);
      }, function (err) {
          console.trace(err.message);
      });

  }, function (err) {
      console.trace(err.message);
  });
  that._client.search({
    index: 'metadata',
    type: slugdataset,
    from: 0,
    size: 1,
    body: {
      query: {
        match: {
          slugsource: slugsource
        }
      }
    }
  }).then(function (resp) {
      var hits = resp.hits.hits;
      hits.forEach(function (i) {
        that.deleteItem("metadata", slugdataset, i["_id"], next);
      }); 
      next(null, hits[0]["_source"]);
  }, function (err) {
      console.trace(err.message);
  });
};


Elasticdb.prototype.search = function(q, dataset, size, from, next) {
    console.log('ElasticDB seach method called');

    this._client.search({
       q: '*' + q + '*',
       size: size,
       from: from,
       type: dataset
    }).then(function (data) {
        console.log(data.hits.hits);
        next(null, data);
    }, function (error) {
        console.trace(error.message);
        next(error, null);
    });
};

/**
 * Export de la classe
 * @type {Mariadb}
 */
module.exports = Elasticdb;


