# DataCity-api

Cliquez [ici](./htmldoc_fr/index.html "") pour accéder à la documentation du module en français

Click [here](./htmldoc_en/index.html "") to have the documentation of the module in english

## Utilisation de l'API

### Utilisateurs

`GET http://localhost:4567/users/list` Liste des utilisateurs
`POST http://localhost:4567/users/add` Ajout d'un utilisateur
```json
{
	username: "test",
	publicKey: "testPublicKey",
	privateKey: "testPrivateKey",
	quota: 100
}
```
`GET http://localhost:4567/users/:publicKey` Informations de l'utilisateur
`DELETE http://localhost:4567/users/:publicKey` Supprime l'utilisateur