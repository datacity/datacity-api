var formidable			=	require("formidable");
var	util				=	require('util');
var genericParser		=	require("genericparser");
var chardet				=	require("chardet");
var fs 					=	require('fs');


exports.index = function(db, callback){
    console.log("INDEX START");

    callback(null, "OK");
};