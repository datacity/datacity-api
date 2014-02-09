var elasticsearch = require('elasticsearch');
// see http://www.elasticsearch.org/blog/client-for-node-js-and-the-browser/

// Connect to localhost:9200 and use the default settings
var client = new elasticsearch.Client();

/*
 * Users Routes
 */
exports.post = function(req, res) {
  res.json(200, {
        status: "success", 
        data: {}
      });
};
