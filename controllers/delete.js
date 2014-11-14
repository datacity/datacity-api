/**
 * Classe pour la suppression de source
 * @param req
 * @param res
 * @param next
 * @param db
 */
var del = function (req, res, next, db) {
    console.log("Requested DELETE with PUBLIC key = " + req.headers.public_key);
};

module.exports = del;