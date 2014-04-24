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
	filesDir + "OSM_MTP_Pharmacie.csv"
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

describe('Site API - Create the user', function () {
	describe('POST /site/users/add - Add a new user', function () {
		it('should return a confirmation', function (done) {
			request(url).post('/site/users/add').send(testUser)
				.expect('Content-Type', /json/).expect(200).end(
				function (err, res) {
					var result = JSON.parse(res.text);
					assert.equal(result.status, "success");
					done();
				});
		});
	});
});

describe('Users API', function () {
	describe('GET /users/list - Get the list of all users', function () {
		it('should return a list of users', function (done) {
			request(url).get('/users/list').expect('Content-Type', /json/)
				.expect(200).end(function (err, res) {
					var result = JSON.parse(res.text);
					assert.equal(result.status, "success");
					done();
				});
		});
	});
	describe('GET /users/' + testUser.publicKey + ' - Get a specific user', function () {
		it('should return the user', function (done) {
			request(url).get('/users/' + testUser.publicKey).expect('Content-Type', /json/)
				.expect(200).end(function (err, res) {
					var result = JSON.parse(res.text);
					assert.equal(result.status, "success");
					done();
				});
		});
	});
	describe('POST /users/' + testUser.publicKey + '/files/add - Upload a file', function () {
		it('should return a detailed list of uploaded files', function (done) {
			request(url).post('/users/' + testUser.publicKey + '/files/add').attach('file', files[0]).attach('file', files[2])
				.expect('Content-Type', /json/).expect(200).end(
				function (err, res) {
					var result = JSON.parse(res.text);
					assert.equal(result.status, "success");
					done();
				});
		});
	});
});


describe('Files API', function () {
	/*
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
	*/
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
	
	describe('GET /users/' + testUser.publicKey + '/files/list', function () {
		it('should return a list of files of the user', function (done) {
			request(url).get('/users/' + testUser.publicKey + '/files/list').expect('Content-Type', /json/)
				.expect(200).end(function (err, res) {
					var result = JSON.parse(res.text);
					assert.equal(result.status, "success");
					done();
				});
		});
	});
	
});

/*
describe('Site API - Delete the user', function () {
	describe('DELETE /site/users/' + testUser.publicKey + ' - Delete an user', function () {
		it('should return a confirmation', function (done) {
			request(url).delete('/site/users/' + testUser.publicKey)
				.expect('Content-Type', /json/).expect(200).end(
				function (err, res) {
					var result = JSON.parse(res.text);
					assert.equal(result.status, "success");
					done();
				});
		});
	});
});
*/


// TUTOS
// http://www.jorisooms.be/testing-your-node-api-with-supertest/
// http://thewayofcode.wordpress.com/2013/04/21/how-to-build-and-test-rest-api-with-nodejs-express-mocha/
// DOC : http://visionmedia.github.io/superagent/
