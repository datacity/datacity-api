var request = require('supertest');
var assert = require('assert');

/*
 * Note: On Windows, it's better to launch mocha with these options:
 *  - $> mocha -R spec
 *  with that we have a better output on the windows command line
 */

// Global parameters
var url = "http://localhost:4567";
var testUser = {
	username: "test",
	publicKey: "testPublicKey",
	privateKey: "testPrivateKey",
	quota: 100
};
var filesDir = "test/";
var files = [
	filesDir + "JSON_TelephonePublic.json",
	filesDir + "JSON_Zoo.json",
];

// UNIT TEST
describe('GET /dfdslk (wrong path)', function () {
	it('should return an error', function (done) {
		request(url).get('/dfdslk').expect('Content-Type', /json/)
			.expect(200).end(function (err, res) {
				var result = JSON.parse(res.text);
				assert.equal(result.status, "error");
				done();
			});
	});
});

describe('Users API', function () {
	describe('GET /user', function () {
		it('should return a list of users', function (done) {
			request(url).get('/user').expect('Content-Type', /json/)
				.expect(200).end(function (err, res) {
					var result = JSON.parse(res.text);
					assert.equal(result.status, "success");
					done();
				});
		});
	});
	describe('POST /user', function () {
		it('should return a confirmation', function (done) {
			request(url).post('/user').send(testUser)
				.expect('Content-Type', /json/).expect(200).end(
				function (err, res) {
					var result = JSON.parse(res.text);
					assert.equal(result.status, "success");
					done();
				});
		});
	});
	//describe('DELETE /user/' + testUser.publicKey, function () {
	//	it('should return a confirmation', function (done) {
	//		request(url).delete('/user/' + testUser.publicKey)
	//			.expect('Content-Type', /json/).expect(200).end(
	//			function (err, res) {
	//				var result = JSON.parse(res.text);
	//				assert.equal(result.status, "success");
	//				done();
	//			});
	//	});
	//});
});

describe('Files API', function () {
	describe('GET /file', function () {
		it('should return a list of files', function (done) {
			request(url).get('/user').expect('Content-Type', /json/)
				.expect(200).end(function (err, res) {
					var result = JSON.parse(res.text);
					assert.equal(result.status, "success");
					done();
				});
		});
	});
	describe('GET /file/feferfr (wrong path)', function () {
		it('should return an error', function (done) {
			request(url).get('/file/feferfr').expect('Content-Type', /json/)
				.end(function (err, res) {
					var result = JSON.parse(res.text);
					assert.equal(result.status, "error");
					done();
				});
		});
	});
	//describe('GET /user/' + testUser.publicKey + '/files (but no files)', function () {
	//	it('should return a list of files of the user', function (done) {
	//		request(url).get('/user/' + testUser.publicKey + '/files').expect('Content-Type', /json/)
	//			.expect(200).end(function (err, res) {
	//				var result = JSON.parse(res.text);
	//				assert.equal(result.status, "error");
	//				done();
	//			});
	//	});
	//});
	//describe('POST /user/' + testUser.publicKey + '/upload', function () {
	//	it('should return a detailed list of uploaded files', function (done) {
	//		request(url).post('/user/' + testUser.publicKey + '/upload').attach('file', files[0])
	//			.expect('Content-Type', /json/).expect(200).end(
	//			function (err, res) {
	//				console.log(res);
	//				//var result = JSON.parse(res.text);
	//				//assert.equal(result.status, "success");
	//				done();
	//			});
	//	});
	//});
});


// TUTOS
// http://www.jorisooms.be/testing-your-node-api-with-supertest/
// http://thewayofcode.wordpress.com/2013/04/21/how-to-build-and-test-rest-api-with-nodejs-express-mocha/
// DOC : http://visionmedia.github.io/superagent/
