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
 */
Middleware.prototype.authenticate = function(req, res, next) {
    var publicKey = req.headers.public_key;
    var privateKey = req.headers.private_key;
    var user = null;

    this.getUser(publicKey, function(data) {
        if (data == null) {                             //Si l'utilisateur n'est pas defini ou introuvable
            req.user_role = 'ANONYME';
        }
        else if (data['private_key'] != privateKey) {   //Si la private key est incorrect
            req.user_role = 'ANONYME';
        }
        else {                                          //Si l'utilisateur est authentifié
            user = data;
            req.user_role = 'USER';
            next();
        }
    });


};

/**
 * Requete mariaDB pour recuperer les infos du user en utilisant sa publicKey.
 * @param publicKey
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
                    console.log('Result error: ' + err);
                })
                .on('end', function(info) {
                    console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            callback(user);
        });
};

module.exports = Middleware;