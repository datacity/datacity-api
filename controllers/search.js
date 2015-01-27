/**
 * Classe pour la recherche de source
 * @param req
 * @param res
 * @param next
 * @param db
 */
var search = function (req, res, next, db) {

    var q = '';
    var dataset = '';
    var facettes;
    var from = 0;
    var size = 10;
    
    if (req.params.q) {
        q = req.params.q;
    }
    if (req.params.start) {
        from = req.params.start;
    }
    if (req.params.rows) {
        size = req.params.rows;
    }
    if (req.params.dataset) {
        dataset = req.params.dataset;
    }
    if (req.params.facettes) {
        facettes = req.params.facettes;
    }
    db.search(q, dataset, size, from, facettes, next);
};

module.exports = search;