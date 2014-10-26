var formidable			=	require("formidable");
var	util				=	require('util');
var genericParser		=	require("genericparser");
var chardet				=	require("chardet");
var fs 					=	require('fs');

var upload = function (req, res, next, db) {
    console.log("Requested upload route");
    return next(null, 'OK');
}

module.exports = upload;