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
        log: 'trace'
    });
};

Elasticdb.prototype.bulk = function(obj, index, type, next) {
  this._client.bulk({
      body: obj,
      refresh: true
    }, function (err, resp, status) {
        if (err) {
          return next(err, null);
        }
        else {
          return next(null, resp);
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
        fs.readFile(hits[0]._source.path, 'utf8', function (err,data) {
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


/**
 * Export de la classe
 * @type {Mariadb}
 */
module.exports = Elasticdb;


