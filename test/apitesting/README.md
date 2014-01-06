# UTILISATION DE FRISBY

lien de la doc :

* http://

Vous devez être sur un environnement Unix. Toutes les versions de windows 8 ainsi que cygwin ne permettent pas d'installer correctement les paquets npm nécéssaires à **cloud9** (npm install). Si vous voulez quand même tenter votre chance, je vous souhaite bon courage.

En ligne de commande, configurer l'environement sur le port 4567

    export PORT=4567
    
Lancer l'application principale avec node en ligne de commande

    node app.js
    
Si vous n'avez pas encore téléchargé frisby, faites le : 

    sudo npm install -g jasmine-node
    cd /datacity-api/test/

pour lancer tous les tests : 

    jasmin-node .
    
pour lancer un fichier en particulier : 

    jasmine-node "FILE"
    
* Attention /!\ Ne lancez pas app.js depuis node !
