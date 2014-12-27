/**
 * Classe pour la suppression de source
 * @param req
 * @param res
 * @param next
 * @param db
 */
var remove = function (req, res, next, db) {
    var data = {};
    console.log("Requested DELETE with PUBLIC key = " + req.headers.public_key);
    return next(null, data);
};

module.exports = remove;