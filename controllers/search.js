/**
 * Classe pour la recherche de source
 * @param req
 * @param res
 * @param next
 * @param db
 */
var search = function (req, res, next, db) {
    console.log("Requested SEARCH with PUBLIC key = " + req.headers.public_key);

    var q = '';
    var dataset = '';
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
    db.search(q, dataset, size, from, next);
};

module.exports = search;