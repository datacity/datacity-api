var elasticsearch = require('elasticsearch');
// see http://www.elasticsearch.org/blog/client-for-node-js-and-the-browser/
// Connect to localhost:9200 and use the default settings
var client = new elasticsearch.Client();

exports.datacityUtils = function() {

    var getUser = function(publicKey, callback) {
        client.search({
            index: 'users',
            type: 'user',
            q: 'publicKey:' + publicKey
        }, callback);
    };

    return {
       checkUserExists : function(publicKey) {
	    // Checks if the user exists
	    // return true or false

        // getUser(publicKey, function (error, response) {
        //     console.log(response.hits);
        // });


	   }
    };
};
