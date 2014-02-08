# Gestion des tests du module generic-parser : 

Pour la mise en place des tests avec mocha rien de plus simple ! Il vous suffit simplement de lancer avec node le fichier mochaLauncher.js se trouvant     dans le répertoire test ou depuis cloud9 avec le simple boutton run.

    node mochaLauncher.js
    

## Tests CSV :


Pour les tests unitaires du parseur et du lexeur csv, nous avons répartit les tests en deux fichiers : 

    testCSVParser.js
    testCSVLexer.js

## Tests JSON

Voici l'exemple d'un fichier JSON en entrée et sa sortie correspondante :

```json
{
   "result": [{ 
        "type": "Feature", "properties": { 
            "type": "Téléphones publics", 
            "osm_id": 1252168854, 
            "osm_url": "http://www.openstreetmap.org/browse/node/1252168854"
        }, 
        "geometry": { 
            "type": "Point", 
            "coordinates": [ 3.881755, 43.609586 ],
            "hardcore" : {
                "montest": "cool",
                "superchaud": "test",
                "encoreplus": {
                    "Superhard": "harddd",
                    "ouaou": "supercool"
                },
            "Cool": {
                "test1": "marche",
                "test2": "fonctionne"
                }
            },
            "Top" : {
                "prout1": "star",
                "cats": "dogs"
            },
            "Le finish" : [ 4.7894, 6544 ]
        } 
    }]
}
```
```json
[
  {
    "_type": "Feature",
    "properties_type": "Téléphones publics",
    "properties_osm_id": 1252168854,
    "properties_osm_url": "http://www.openstreetmap.org/browse/node/1252168854",
    "geometry_type": "Point",
    "geometry_coordinates": [
      3.881755,
      43.609586
    ],
    "geometry_hardcore_montest": "cool",
    "geometry_hardcore_superchaud": "test",
    "geometry_hardcore_encoreplus_Superhard": "harddd",
    "geometry_hardcore_encoreplus_ouaou": "supercool",
    "geometry_hardcore_Cool_test1": "marche",
    "geometry_hardcore_Cool_test2": "fonctionne",
    "geometry_Top_prout1": "star",
    "geometry_Top_cats": "dogs",
    "geometry_Le finish": [
      4.7894,
      6544
    ]
  }
]
```

#### Exemple de test : 

```diff
Csv lexer:
     ✓ Should test the error function
        ➢ Error: Test my error
     ✓ Should test the parseLines function
     ✓ Should give invalid parameters on parseLines and get proper error
        ➢ Error: Invalid parameter on lines
    ✓ Should test the extractLines function
    ✓ Should test the parse function with a file of many separators and the : should not be considered as separator
        ➢ {"delimiter":",","quote":"\"","escape":"\""}
    ✓ Should test the parse function with a file of separator ;
        ➢ {"delimiter":";","quote":"\"","escape":"\""}
    1) Should test the parse function with a file of separator tab
    ✓ Should test the parse function with a file of separator :  
        ➢ {"delimiter":":","quote":"\"","escape":"\""}
    ✓ Should test the parse function with separator and fields surrounded by simple quote
        ➢ {"delimiter":";","quote":"'","escape":"\""}
  Csv parser
    2) Should launch an error because of a readstream into the from function
    ✓ Should Work with this big open data file
    ✓ Should Work with this big open data file (8M octets)
10 passing (106ms)
  2 failing
  1) Csv lexer:  Should test the parse function with a file of separator tab:
      + expected - actual
      +"\t"
      -","
      
      at Object.Assertion.eql (/usr/lib/node_modules/should/lib/should.js:370:10)
      at null. (/home/raphael/Developments/datacity-api/node_modules/genericparser/test/testCSVLexer.js:75:38)
      at EventEmitter.emit (events.js:96:17)
      at CsvLexer.parseLines (/home/raphael/Developments/datacity-api/node_modules/genericparser/lib/csvLexer.js:58:10)
      at CsvLexer.parse (/home/raphael/Developments/datacity-api/node_modules/genericparser/lib/csvLexer.js:91:14)
      at CsvLexer.extractLines (/home/raphael/Developments/datacity-api/node_modules/genericparser/lib/csvLexer.js:80:21)
      at Object.wrapper [as oncomplete] (fs.js:362:17)
  2) Csv parser Should launch an error because of a readstream into the from function:
     TypeError: path must be a string
      at Object.fs.open (fs.js:330:11)
      at CsvLexer.extractLines (/home/raphael/Developments/datacity-api/node_modules/genericparser/lib/csvLexer.js:73:8)
      at CsvLexer.parse (/home/raphael/Developments/datacity-api/node_modules/genericparser/lib/csvLexer.js:90:10)
      at CsvParser.from (/home/raphael/Developments/datacity-api/node_modules/genericparser/lib/parserCSV.js:55:9)
      at Context. (/home/raphael/Developments/datacity-api/node_modules/genericparser/test/testCSVParser.js:7:10)
      at Test.Runnable.run (/home/raphael/Developments/datacity-api/node_modules/genericparser/node_modules/mocha/lib/runnable.js:221:32)
      at Runner.runTest (/home/raphael/Developments/datacity-api/node_modules/genericparser/node_modules/mocha/lib/runner.js:378:10)
      at Runner.runTests.next (/home/raphael/Developments/datacity-api/node_modules/genericparser/node_modules/mocha/lib/runner.js:456:12)
      at next (/home/raphael/Developments/datacity-api/node_modules/genericparser/node_modules/mocha/lib/runner.js:303:14)
      at Runner.hooks (/home/raphael/Developments/datacity-api/node_modules/genericparser/node_modules/mocha/lib/runner.js:313:7)
```










    
