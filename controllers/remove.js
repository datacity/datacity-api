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
    db.deleteDataset(req.params.slugdataset, next);
};

module.exports = remove;