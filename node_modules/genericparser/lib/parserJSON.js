var fs = require("fs");
var events = require("events");
var chardet = require('chardet');
var Iconv = require("iconv").Iconv;

/**
 * Serialize the json to have just one level. Convert array and objects as a final string and change the name of the columns
 * Here is an example of before and after the input is serialize
 * @example 
 * {
 *   "ex" : {
 *             "1" : "test",
 *             "2" : "ok"
 *          }
 * }
 * @example
 * {
 *   "ex_1" : "test",
 *   "ex_2" : "ok"
 * }
 * @param  {string}  currentKey     the current key of the object browsing
 * @param  {Object}  currentObject  the json object who need to be serialized  
 * @param  {Object}  result         the json object serialized (need to be initalized to: var res = {})
 * @param  {Boolean} isArray        need to be initialized to false. It will be true if the current subobject is an array 
 * @param  {Boolean} isObject       need to be initialized to false. It will be true if the current subobject is an object
 */
function serializeJSON(currentKey, currentObject, result, isArray, isObject) {
    for (var key in currentObject) {
        if (isNaN(parseInt(key)) === false && (typeof currentObject[key] === "string" || typeof currentObject[key] === "number")) {
             result[currentKey] = [];
             result[currentKey] = currentObject;
             break;
        }
        else if ((typeof currentObject[key] === "string" || typeof currentObject[key] === "number") && isArray === false)
            currentKey === "" ? result[key] = currentObject[key] : result[currentKey+"_"+key] = currentObject[key];
        else if ((typeof currentObject[key] === "string" || typeof currentObject[key] === "number") && isArray === true) {
            if (!result[currentKey+"_"+key]) {
                result[currentKey+"_"+key] = [];
                result[currentKey+"_"+key].push(currentObject[key]);
            }
            else
                result[currentKey+"_"+key].push(currentObject[key]);
        }
        if (currentObject[key] instanceof Array && isObject === true)
            serializeJSON(currentKey+"_"+key, currentObject[key], result, false);
        else if (currentObject[key] instanceof Array && isObject === false) 
            serializeJSON(key, currentObject[key], result, true, false);
        else if (currentObject[key] instanceof Object && isArray === false && isObject === true)
            serializeJSON(currentKey+"_"+key, currentObject[key], result, false, true);
        else if (currentObject[key] instanceof Object && isArray === false)
            serializeJSON(key, currentObject[key], result, false, true);
        else if (currentObject[key] instanceof Object && isArray === true)
            serializeJSON(currentKey, currentObject[key], result, true, true);
    }
}

/**
 * @class See also {@link parserCSV}, {@link parserXML}
 */
function parserJSON() {}

parserJSON.prototype.__proto__ = events.EventEmitter.prototype;

/**
 * Convert a json file opened by a path into json.
 * @param  {string}   fileName  path of the file
 * @param  {Boolean}  noRam     if true, it will send the parsed file line by line otherwise, all the parsed file will be send
 * @param  {function(result, index)} callback
 * @param {string} callback.result the parsed file line by line or the entire one
 * @param {string} callback.index the index of the line if noRam is true
 * @return {void}
 */
parserJSON.prototype.parse = function(fileName, noRam, callback) {
      if (fs.existsSync(fileName) === false) {
        this.emit("error", new Error("erreur : le fichier n'existe pas !"));
        return;
    }
    var stream = fs.createReadStream(fileName);
    
    var lines = 1;
    var that = this;
    var main = [];
    var type = chardet.detectFileSync(fileName);
    
    stream.on('data', function(sdata) {
        var iconv = new Iconv(type, 'UTF-8');
        sdata = iconv.convert(sdata).toString("utf8");
        var json = JSON.parse(sdata.replace(/\\/g, ""));
        
        var result = {};
        var keys = Object.keys(json);
    
        for (var index in keys ) {
            if (json[keys[index]] instanceof Array) {
                if (json[keys[index]][0] && json[keys[index]][0] instanceof Object) {
                    for (var obj in json[keys[index]]) {
                        result = {};
                        serializeJSON("", json[keys[index]][obj], result, false, false);
                        if (noRam === true && callback) 
                           callback(result, lines);
                        else if (noRam === false)
                           main.push(result);
                         lines++;
                   }
                   break;
                }
              }
         }
    })
    .on("end", function() {
      if (callback) {
          if (noRam === true)
            callback(null, lines);
          else 
            callback(main, lines);
      }
    })
    .on('error', function(error){
          that.emit("error", new Error("erreur pendant la lecture du flux dans le parseur json"))
    });
}
module.exports = parserJSON;