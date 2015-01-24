/**
 * Classe pour la suppression de source
 * @param req
 * @param res
 * @param next
 * @param db
 */
var removeSource = function (req, res, next, db) {
    db.deleteSource(req.params.slugdataset, req.params.slugsource, next);
};

module.exports = removeSource;