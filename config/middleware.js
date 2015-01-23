/**
 *  S'occupe de verifier les permissions et connexion avant toute action.
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
 * @param next
 */
Middleware.prototype.authenticate = function(req, res, next) {
    var publicKey = req.headers.public_key;
    var privateKey = req.headers.private_key;
    var user = null;

    this.getUser(publicKey, function(data) {
        if (data == null || data['private_key'] != privateKey) {                             //Si l'utilisateur n'est pas defini ou introuvable
            tools.report('Utilisateur non authentifié, role anonyme attribué.');
            req.user_role = 'ANONYME';
            next();
        }
        else {                                                                              //Si l'utilisateur est authentifié
            tools.report('Utilisateur authentifié');
            tools.report(data);
            user = data;
            req.user_role = 'USER';
            next();
        }
    });


};

/**
 * Requete mariaDB pour recuperer les infos du user en utilisant sa publicKey.
 * @param publicKey
 * @param callback
 * @returns {*}
 */
Middleware.prototype.getUser = function(publicKey, callback) {
    var user = null;

    this._db._client.query('SELECT * FROM datacity_user WHERE public_key = :publicKey',
        {publicKey: publicKey})
        .on('result', function(res) {
            res.on('row', function(row) {
                user = row;
            })
                .on('error', function(err) {
                    tools.report('Result error: ' + err);
                })
                .on('end', function(info) {
                    tools.report('Result finished successfully');
                });
        })
        .on('end', function() {
            callback(user);
        });
};

module.exports = Middleware;