var util = require('util');
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
 * Fonction de reponse pour le download
 * @param req
 * @param res
 * @param err
 * @param data
 */
Tools.prototype.answerFile = function(req, res, err, data) {
    this.report(req.user_role + ' requested ' + req.route.path + '...');
    //console.log("DATA = " + util.inspect(data));
    if (err) {
        res.json(err == 'You must login' ? 401 : 400, {
            status: "error",
            data: err
        });
        this.report('Error for ' + req.route.path + ' request with ' + req.route.method + ' method.');
    } else if (data != undefined) {
        var resData = new Buffer(util.inspect(data));
        this.report('Success for ' + req.route.path + ' request with ' + req.route.method + ' method.');
        res.writeHead(200, { 'Content-Type': 'application/' + req.params.format,
                          'Content-Length': resData.length,
                          'Content-Disposition': 'attachment;filename=' + req.params.slugdataset + '.' + req.params.format });
        res.write(resData, "utf-8");
        res.end();

        this.report('Response sent !');
    } else {
       res.json(400, {
            status: "error",
            data: "No data found for dataset " + req.params.slugdataset
        }); 
    }
};

/**
 * Export de la classe
 * @type {Tools}
 */
 module.exports = Tools;