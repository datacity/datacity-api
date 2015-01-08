var getModel = function (req, res, next, db) {
    db.getModel(req.params.slugdataset, req.params.slugsource, next)
};

module.exports = getModel;