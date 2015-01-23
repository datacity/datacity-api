/**
 * Classe de fonctions utiles a travers l'appli
 * @constructor
 */
function Tools(debugMode) {
    this._debugMode = debugMode;
}

/**
 * Affiche les messages de debug si demandé
 * @param message
 */
Tools.prototype.report = function(message) {
    if (this._debugMode) {
        console.log(message);
    }
};

/**
 * Fonction generique de reponse des differentes routes de l'API
 * @param req
 * @param res
 * @param err
 * @param data
 */
Tools.prototype.answer = function(req, res, err, data) {
    this.report(req.user_role + ' requested ' + req.route.path + '...');
    if (err) {
        res.json(err == 'You must login' ? 401 : 400, {
            status: "error",
            data: err
        });
        this.report('Error for ' + req.route.path + ' request with ' + req.route.method + ' method.');
    } else if (data != undefined) {
        this.report('Success for ' + req.route.path + ' request with ' + req.route.method + ' method.');
        res.json(200, {
            status: "success",
            data: data
        });
        this.report('Response sent !');
    }
};

/**
 * Export de la classe
 * @type {Tools}
 */
 module.exports = Tools;