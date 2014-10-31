var Client = require('mariasql');

/**
 * Classe de connexion a la base de donnée MariaDB
 * @constructor
 */
function Mariadb() {

    this._host = '127.0.0.1';
    this._username = 'datacity';
    this._password = 'datacity';
    this._client = null;
}

/**
 * Instanciate client and connect to mariadb
 */
Mariadb.prototype.connect = function() {
    this._client = new Client();
    this._client.connect({
        host: this._host,
        user: this._username,
        password: this._password
    });

    this._client.on('connect', function() {
        console.log('Maria Client connected');
    })
        .on('error', function(err) {
            console.log('Client error: ' + err);
        })
        .on('close', function(hadError) {
            if (hadError)
                console.log('Client closed with errors');
            else
                console.log('Client closed without errors');
        });
};

/**
 * Closes the connection once all queries in the queue have been executed.
 */
Mariadb.prototype.end = function() {
  if (this._client != null) {
      this._client.end();
  }
};

/**
 * Export de la classe
 * @type {Mariadb}
 */
module.exports = Mariadb;