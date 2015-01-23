/**
 * Classe pour la suppression de source
 * @param req
 * @param res
 * @param next
 * @param db
 */
var removeDataset = function (req, res, next, db) {
    var data = {};
    tools.report("Requested DELETE with PUBLIC key = " + req.headers.public_key);
    db.deleteDataset(req.params.slugdataset, next);
};

module.exports = removeDataset;