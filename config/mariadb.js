var Client = require('mariasql');

/**
 * Classe de connexion a la base de donnée MariaDB
 */
function Mariadb() {

    this.host = '127.0.0.1';
    this.username = 'datacity';
    this.password = 'datacity';
    this.client = null;
}

/**
 * Instanciate client and connect to mariadb
 */
Mariadb.prototype.connect = function() {
    this.client = new Client();
    this.client.connect({
        host: this.host,
        user: this.username,
        password: this.password
    });

    this.client.on('connect', function() {
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
  if (this.client != null) {
      this.client.end();
  }
};

/**
 * Export de la classe
 * @type {Mariadb}
 */
module.exports = Mariadb;