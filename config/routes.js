var parser = require("../controllers/parse");
var upload = require("../controllers/upload");
var download = require("../controllers/download");
var removeDataset = require("../controllers/removeDataset");
var removeSource = require("../controllers/removeSource");
var getModel = require("../controllers/getModel");
var search = require("../controllers/search");

module.exports = function(server, db) {
    //POST - Parse (uploading sources)
    server.post({
        path: '/parse'
        , version: '1.0.0'
    }, function(req, res) {
        parser(req, res, function(err, data) {
            tools.answer(req, res, err, data);
        });
    });

    //POST - Upload (uploading sources)
    server.post({
        path: '/:slugdataset/source'
        , params: {
            slugdataset: 'string'
        }
        , version: '1.0.0'
    }, function(req, res) {
        upload(req, res, function(err, data) {
            tools.answer(req, res, err, data);
        }, db);
    });

    //Download a file
    server.get({
        path: '/:slugdataset/download'
        , params: {
            slugdataset: 'string'
        }
        , version: '1.0.0'
    }, function(req, res) {
        download(req, res, function(err, data) {
            tools.answer(req, res, err, data);
        }, db);
    });

    //Get the model
    server.get({
        path: '/:slugdataset/model'
        , params: {
            slugsource: 'string'
        }
        , version: '1.0.0'
    }, function(req, res) {
        getModel(req, res, function(err, data) {
            tools.answer(req, res, err, data);
        }, db);
    });

    //DELETE dataset
    server.del({
        path: '/:slugdataset'
        , params: {
            slugdataset: 'string'
        }
        , version: '1.0.0'
    }, function(req, res) {
        removeDataset(req, res, function(err, data) {
            tools.answer(req, res, err, data);
        }, db);
    });

        //DELETE SOURCE
    server.del({
        path: '/:slugdataset/:slugsource'
        , params: {
            slugdataset: 'string',
            slugsource: 'string'
        }
        , version: '1.0.0'
    }, function(req, res) {
        removeSource(req, res, function(err, data) {
            tools.answer(req, res, err, data);
        }, db);
    });

    //SEARCH
    server.get({
        path: '/search'
        , version: '1.0.0'
    }, function(req, res) {
        search(req, res, function(err, data) {
            tools.answer(req, res, err, data);
        }, db);
    });
};