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

Elasticdb.prototype.bulkNoNext = function(obj, index, slugname) {
  this._client.bulk({
      body: obj,
      refresh: true
    }, function (err, resp, status) {
        if (err) {
          return false;
        }
        else {
          return true;
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

Elasticdb.prototype.download = function(slugdataset, format, next) {
  var that = this;
  var length = 0;

  this._client.count({
    index: 'sources',
    type: slugdataset
    }).then(function (resp) {
     length = resp.count;
      that._client.search({
        index: 'sources',
        type: slugdataset,
        from: 0,
        size: length
      }).then(function (resp) {
          var genericParser = require("genericparser");
          var hits = resp.hits.hits;
          if (format == "json")
            return next(null, genericParser.exportJSON(hits));
          else if (format == "xml")
            return next(null, genericParser.exportXML(hits));
          else if (format == "csv") {
            return genericParser.exportCSV(hits, function (result) {
              next(null, result);
            });
          }
          return next("Invalid format requested.", null);
    }, function (err) {
        console.trace(err.message);
        return next("ElacticSearch error: " + err.message, null);
    });
  }, function (err) {
      console.trace(err.message);
      return next("ElacticSearch error: " + err.message, null);
  });
};

Elasticdb.prototype.getModel = function(type, source, next) {
  tools.report("Search model for " + source);
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
  tools.report("DELETE " + slugname);
  this._client.deleteByQuery({
    index: ['sources', 'metadata'],
    q: '_type: ' + slugname
  }, function (error, response) {
    tools.report(response);
    tools.report(error);
    next(error, response);
  });
};

Elasticdb.prototype.deleteMetadata = function(dataset, next) {

    tools.report("DELETE " + dataset);
    this._client.deleteByQuery({
        index: 'metadata',
        q: '_type: ' + dataset
    }, function (error, response) {
        tools.report(response);
        tools.report(error);
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
              tools.report(response);
            return response;
          }
          tools.report(error);
          return error;
        });
};

Elasticdb.prototype.deleteSource = function(slugdataset, slugsource, next) {
  tools.report("DELETE " + slugdataset + "/" + slugsource);
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


Elasticdb.prototype.search = function(q, dataset, size, from, facettes, next) {
    tools.report('ElasticDB search method called');
    var that = this;
    var genericparser = require("genericparser");

    this._client.search({
       index: "sources",
       fields : facettes,// http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/search-request-fields.html
       q: '*' + q + '*',
       size: size,
       from: from,
       type: dataset
    }).then(function (data) {
      if (size != 0) {
        next(null, genericparser.clean(data["hits"]["hits"]));
      } else {
          that._client.search({
            index: "sources",
            fields : facettes,
            q: '*' + q + '*',
            from: from,
            type: dataset,
            size: data.hits.total,
          }).then(function (resp) {
            next(null, genericparser.clean(resp["hits"]["hits"]));
          }, function (err) {
              next(err, null);
              console.trace(err.message);
          });
      }
    }, function (error) {
        tools.report(error.message);
        next(error, null);
    });
};

/**
 * Export de la classe
 * @type {Mariadb}
 */
module.exports = Elasticdb;


