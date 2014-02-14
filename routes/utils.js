var datacityUtils = (function() {
    var elasticsearch = require('elasticsearch');
    // see http://www.elasticsearch.org/blog/client-for-node-js-and-the-browser/
    // Connect to localhost:9200 and use the default settings
    var client = new elasticsearch.Client();

    var getUser = function(publicKey) {
	// TODO : get and return user informations
    };

    return {
	checkUserExists : function(publicKey) {
	    // Checks if the user exists
	    // return true or false
	}
    };
})();
