/**
 *  S'occupe de verifier les permissions avant toute action.
 * @constructor
 */
function    Middleware(restify, mariaClient) {
    this._server = restify;
    this._db = mariaClient;
}

/**
 * Fonction d'authentification
 * @param req
 * @param res
 */
Middleware.prototype.authenticate = function(req, res) {
    console.log("Usercheck middleware !");
};

module.exports = Middleware;