
/*
 * GET home page.
 */

exports.index = function (req, res) {
	res.render('index.html');
};

/*
 * GET test pages
 */

exports.testUpload = function (req, res) {
	res.render('testUploadFile.html');
};