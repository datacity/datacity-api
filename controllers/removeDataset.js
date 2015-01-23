/**
 * Classe pour la suppression de source
 * @param req
 * @param res
 * @param next
 * @param db
 */
var removeDataset = function (req, res, next, db) {
    db.deleteDataset(req.params.slugdataset, next);
};

module.exports = removeDataset;