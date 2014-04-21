var csvParser = require('./parserCSV.js');
var xmlParser = require('./parserXML.js');
var jsonParser = require('./parserJSON.js');
var xlsParser = require('./parserXLS.js');

/**
 * @class The class who instantiate different parsers
 * @param {string} inputType type of parsing sended
 * @tutorial ../tutorials/README.md
 * @return {Object} the parser object which correspond to the inputType. 
 * See also {@link parserCSV}, {@link parserJSON}, {@link parserXML}
 */
var GenericParser = function(inputType) {
  this.types = {
      "csv" : csvParser,
      "xml" : xmlParser,
      "json": jsonParser,
      "xls" : xlsParser
  };
  var that = this;
  if (!this.types[inputType]) {
    return;
  }
  return new types[inputType]();
};

module.exports = GenericParser;