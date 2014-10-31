var elasticsearch = require('elasticsearch');


/**
 * Classe de connexion a la base de donnée ElasticSearch
 * @constructor
 */
function    Elasticdb() {

    this._host = '127.0.0.1';
    this._client = null;
}

/**
 * Instantiates client and connects to elasticsearch
 */
Elasticdb.prototype.connect = function() {

    this._client = new elasticsearch.Client({
        host: this._host,
        log: 'trace'
    });
};

/**
 * Export de la classe
 * @type {Mariadb}
 */
module.exports = Elasticdb;


