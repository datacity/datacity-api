# DataCity-api

Vous devez être sur un environnement Unix. Toutes les versions de windows 8 ainsi que cygwin ne permettent pas d'installer correctement les paquets npm nécéssaires à **cloud9** (npm install). Si vous voulez quand même tenter votre chance, je vous souhaite bon courage.

## Installation de cloud9 :

Installation sur Ubuntu 13.04 :

1) Installer l'avant derniere version stable de node.js (**v0.8.22**) :

* http://blog.nodejs.org/2013/03/06/node-v0-8-22-stable/

La version 10 de node.js n'est pas encore suportée (ca ne saurait tarder).
- Choisissez le version .tar.gz et dézippez le dossier que vous voulez.
- Copiez l'executable node dans votre répertoire /usr/bin
- Copiez le lien npm dans votre repertoire /usr/bin

2) Installer Cloud9

    git clone https://github.com/ajaxorg/cloud9.git
    cd cloud9
    npm install

Avant de lancer cloud9, faites un clone sur le dépot datacity api :

    git clone https://github.com/raphael-amar/datacity-api.git

Si vous ne pouvez pas cloner le dépôt, c'est normal, c'est un dépôt privé. Envoyez moi votre mail pour que je vous ajoute.

3) Lancer cloud9 :

l'option -w permet de spécifer votre workspace :

    node server.js -w ~/chemin/depot-datacity.
    firefox http://localhost:3131

## Installation de elasticsearch

Pour pouvoir run le projet depuis cloud9 avec le petit bouton run, il va falloir au préalable installer elasticsearch sur votre machine.
Pour ce faire installez le jdk (elasticsearch, c'est du Java !) :

    apt-get install openjdk-7-jre-headless

Installez ensuite elasticsearch :

    apt-get install elasticsearch

Elasticsearch s'est installé dans /usr/share/elasticsearch.
Maintenant, installez le plugin head pour visualiser vos données plus facilement:

    cd /usr/share/elasticsearch/bin
    sudo ./plugin -install mobz/elasticsearch-head

Maintenant, il suffit simplement de tout lancer : 

    sudo service elasticsearch start
    firefox http://localhost:9200/_plugin/head/

Retournez sur cloud9 et cliquez sur run
Retournez sur cette url : 

* http://localhost:9200/_plugin/head/

Un nouvel index a été créé et elasticsearch est en parfaite hosmose avec l'environnement node.js dans l'ide cloud9. Il ne reste plus qu'a mettre en place les modules, penser à l'archtecture et se servir de tout ces outils! En route les amis !

## Documentation API

