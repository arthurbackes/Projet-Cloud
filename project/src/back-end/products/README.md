# Service products

Gère le catalogue des produits (liste, détail, ajout, modification, suppression)
Le service a sa propre base CouchDB `products`

## Lancement

Le service est dans `scapp.yml` (`products-daemon` et `products-db`)

```bash
docker build -t ${DOCKER_ID}/scapp-products:latest .
docker push ${DOCKER_ID}/scapp-products:latest
```

Ports : 3002 pour le service, 3003 pour CouchDB.

Variables d'environnement :
- `DB_URL` : URL de la base
- `DB_NAME` : `products`
- `WITH_PERSISTENT_DATA` : si défini, crée la base au démarrage et ajoute les produits du fichier `seed/product.jsonl`
- `TOKEN_SECRET` : même secret que le service users

## API

Un produit ressemble à ceci : `{ id, name, price, stock, category, description, image }`.
Si on ne donne pas description et image, `description` vaut `""` et `image` vaut `null`.

Les erreurs ressemblent à ceci : `{ "status": "error", "message": "..." }`.

Les routes POST, PUT et DELETE demandent un jeton admin dans l'en-tête `Authorization: Bearer <token>` (401 sans jeton valide, 403 si l'utilisateur n'est pas admin). Les GET sont publics.