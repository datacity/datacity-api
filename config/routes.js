var upload = require("../controllers/files");

module.exports = function(server, db) {
    //POST - Upload
    server.get({
        path: '/things/:id'
        , version: '1.0.0'
        , params: {
            id: 'number'
        }
    }, function(req, res) {
        upload.index(db, function(err, data) {
            if (err)
                console.log("An error occured for GET");
            res.send(data);
        });
    });
};