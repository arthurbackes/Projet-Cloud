# Contrat d'API - Projet SCApp

Ce document définit les routes de l'API, les formats de requêtes attendus par le serveur et les réponses renvoyées au client.

**Note générale sur l'authentification :**
Toutes les routes (sauf l'inscription, la connexion et la consultation des
produits) nécessitent d'envoyer le jeton JWT dans les en-têtes de la requête :
`Authorization: Bearer <token>`

**Format d'erreur commun à tous les services :**
```json
{ "status": "error", "message": "Description de l'erreur" }
```
Toute route protégée peut renvoyer `401` (token absent ou invalide) et toute
route admin peut renvoyer `403` (pas admin).

**CORS :** chaque service doit autoriser l'en-tête `Authorization` et les
méthodes `GET, POST, PUT, DELETE`.

---

## 1. Authentification (Auth)

Le service d'authentification utilise `username` comme identifiant. Les mots de
passe sont envoyés dans le corps JSON des requêtes et ne doivent jamais être
placés dans une URL.

### Inscription d'un utilisateur
*   **Route :** `POST /user`
*   **Body attendu :**
    ```json
    {
      "username": "alice",
      "password": "password123"
    }
    ```
*   **Réponse Succès (`201 Created`) :**
    ```json
    {
      "status": "success",
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "username": "alice",
        "role": "user"
      }
    }
    ```
*   **Erreurs possibles :**
    *   `400 Bad Request` : Données manquantes ou invalides.
    *   `409 Conflict` : Nom d'utilisateur déjà utilisé.

### Connexion d'un utilisateur
*   **Route :** `POST /user/login`
*   **Body attendu :**
    ```json
    {
      "username": "alice",
      "password": "password123"
    }
    ```
*   **Réponse Succès (`200 OK`) :**
    ```json
    {
      "status": "success",
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "user": {
        "username": "alice",
        "role": "user"
      }
    }
    ```
*   **Erreurs possibles :**
    *   `400 Bad Request` : Données manquantes.
    *   `401 Unauthorized` : Nom d'utilisateur inconnu ou mot de passe incorrect.

### Vérification d'identité et de rôle
Les autres services réutilisent le middleware d'authentification fourni par le
service users. Il vérifie le JWT envoyé dans `Authorization: Bearer <token>` et
expose `username` et `role` à la requête. Un middleware de rôle peut ensuite
refuser l'accès aux routes réservées aux administrateurs avec `403 Forbidden`.

Le JWT contient au minimum `sub`, `role`, `iat` et `exp`. Le secret de signature
est fourni par la variable d'environnement `TOKEN_SECRET` et ne doit pas être
codé dans le dépôt.

### Compte administrateur
Une inscription crée toujours un compte `role: "user"`. Le compte admin est
créé au démarrage du service users à partir des variables d'environnement
`ADMIN_USERNAME` et `ADMIN_PASSWORD`.

---

## 2. Produits (Catalogue)

### Récupérer tous les produits
*   **Route :** `GET /api/products`
*   **Body attendu :** Aucun
*   **Réponse Succès (`200 OK`) :**
    ```json
    [
      {
        "id": "p1",
        "name": "Laptop Dell",
        "description": "Laptop 15 pouces",
        "price": 1200,
        "category": "Informatique",
        "image": "https://<compte>.blob.core.windows.net/products/p1.jpg",
        "stock": 5
      }
    ]
    ```
    Liste plate : le front regroupe les produits par `category`.

### Récupérer un produit spécifique
*   **Route :** `GET /api/products/:id` (ex: `/api/products/p1`)
*   **Body attendu :** Aucun
*   **Réponse Succès (`200 OK`) :** un produit (même format que ci-dessus).
*   **Erreurs possibles :**
    *   `404 Not Found` : Produit inexistant.

### Créer un produit (admin)
*   **Route :** `POST /api/products`
*   **Body attendu :** `multipart/form-data` avec les champs `name`,
    `description`, `price`, `category`, `stock` et le fichier `image`.
    L'image est envoyée vers Azure Storage et son URL est enregistrée dans `image`.
*   **Réponse Succès (`201 Created`) :** le produit créé.
*   **Erreurs possibles :**
    *   `400 Bad Request` : Champ manquant ou invalide, image refusée.

### Modifier un produit (admin)
*   **Route :** `PUT /api/products/:id`
*   **Body attendu :** les champs à modifier (`name`, `description`, `price`,
    `category`, `stock`). Pour changer l'image, envoyer en `multipart/form-data`
    avec le fichier `image`.
*   **Réponse Succès (`200 OK`) :** le produit modifié.
*   **Erreurs possibles :**
    *   `400 Bad Request` : Valeur invalide.
    *   `404 Not Found` : Produit inexistant.

### Supprimer un produit (admin)
*   **Route :** `DELETE /api/products/:id`
*   **Réponse Succès (`204 No Content`)**
*   **Erreurs possibles :**
    *   `404 Not Found` : Produit inexistant.

---

## 3. Panier (Cart)

### Voir son panier
*   **Route :** `GET /api/cart`
*   **Authentification :** `Authorization: Bearer <token>` obligatoire
*   **Body attendu :** Aucun (l'utilisateur est identifié via le token)
*   **Réponse Succès (`200 OK`) :** Tableau des articles du panier.
    ```json
    [
      {
        "_id": "p1",
        "name": "Laptop Dell",
        "quantity": 1,
        "price": 1200
      }
    ]
    ```
    Panier vide : `[]` (aucun article). Le serveur ne renvoie pas de `404` pour un panier vide.
*   **Erreurs possibles :**
    *   `401 Unauthorized` : Token manquant ou invalide.
    *   `500 Internal Server Error` : Impossible de récupérer le panier.

### Ajouter un produit au panier
*   **Route :** `POST /api/cart`
*   **Authentification :** `Authorization: Bearer <token>` obligatoire
*   **Body attendu :**
    ```json
    {
      "productID": "p2",
      "quantity": 2
    }
    ```
    `quantity` est optionnelle. Si elle n'est pas fournie, le backend utilise `1`.
    Si le produit existe déjà dans le panier, sa quantité est incrémentée
    de `quantity`. Sinon, le produit est ajouté.
*   **Réponse Succès (`200 OK`) :** Retourne directement le tableau du panier mis à jour.
    ```json
    [
      {
        "_id": "p2",
        "name": "Nom du produit",
        "quantity": 2,
        "price": 100
      }
    ]
    ```
*   **Erreurs possibles :**
    *   `401 Unauthorized` : Token manquant ou invalide.
    *   `404 Not Found` : Produit inexistant.
    *   `500 Internal Server Error` : Impossible d'ajouter le produit au panier.

### Retirer un produit du panier
*   **Route :** `DELETE /api/cart/:productID`
*   **Authentification :** `Authorization: Bearer <token>` obligatoire
*   **Paramètre d'URL :** `_id` du produit à retirer, transmis sous le nom `productID`.
*   **Réponse Succès (`200 OK`) :** Retourne directement le tableau du panier mis à jour.
    ```json
    []
    ```
*   **Erreurs possibles :**
    *   `401 Unauthorized` : Token manquant ou invalide.
    *   `500 Internal Server Error` : Impossible de retirer le produit du panier.

---

## 4. Achats (Purchases)

### Valider le panier et créer une commande
*   **Route :** `POST /api/purchases`
*   **Authentification :** `Authorization: Bearer <token>` obligatoire
*   **Body attendu :** Aucun. Le serveur identifie l'utilisateur via le token,
    vide le panier actuel et crée la commande.
*   **Réponse Succès (`201 Created`) :**
    ```json
    {
      "orderId": "ord_1731168000000",
      "date": "2026-11-09T10:00:00.000Z",
      "total": 1200,
      "items": [
        {
          "_id": "p1",
          "name": "Laptop Dell",
          "quantity": 1,
          "price": 1200
        }
      ]
    }
    ```
*   **Erreurs possibles :**
    *   `400 Bad Request` : Panier vide.
    *   `401 Unauthorized` : Token manquant ou invalide.
*   **Notes :**
    *   `orderId` est généré au format `ord_<timestamp>`.
    *   Le prix de chaque article est celui enregistré dans le panier.
    *   En cas d'erreur, le panier n'est pas vidé.
    *   Après une première validation réussie, le panier est vide. Une seconde
        validation renvoie `400 Bad Request` et ne crée pas de deuxième commande.

### Historique des achats
*   **Route :** `GET /api/purchases`
*   **Authentification :** `Authorization: Bearer <token>` obligatoire
*   **Body attendu :** Aucun
*   **Réponse Succès (`200 OK`) :** Tableau des commandes enregistrées.
    ```json
    [
      {
        "orderId": "ord_1731168000000",
        "date": "2026-11-09T10:00:00.000Z",
        "total": 1200,
        "items": [
          {
            "_id": "p1",
            "name": "Laptop Dell",
            "quantity": 1,
            "price": 1200
          }
        ]
      }
    ]
    ```
    Aucun achat : `[]`. Le backend ne retourne pas les achats dans un objet
    contenant un champ supplémentaire.
*   **Erreurs possibles :**
    *   `401 Unauthorized` : Token manquant ou invalide.
    *   `500 Internal Server Error` : Impossible de récupérer l'historique.

---

## 5. Logs

### Enregistrer un événement (front-end ou service)
*   **Route :** `POST /api/logs`
*   **Body attendu :**
    ```json
    {
      "action": "view_product",
      "productId": "p1",
      "service": "frontend",
      "durationMs": null,
      "status": null
    }
    ```
    *   `action` parmi : `view_product`, `add_to_cart`, `remove_from_cart`,
        `checkout`, `login`, `register`, `request` (mesure de performance).
    *   Pour `request`, le service envoie aussi `route`, `durationMs` et le
        code HTTP dans `status`.
    *   L'utilisateur et la date sont ajoutés par le serveur (via le token,
        `anonymous` si pas de token).
    *   L'envoi est asynchrone : une panne du service logs ne bloque jamais
        la requête de l'utilisateur.
*   **Réponse Succès (`201 Created`) :**
    ```json
    { "status": "logged" }
    ```

---

## 6. Recommandations

### Recommandations pour l'utilisateur connecté
*   **Route :** `GET /api/recommendations`
*   **Body attendu :** Aucun (utilisateur identifié via le token)
*   **Réponse Succès (`200 OK`) :** une liste de produits (même format que
    `GET /api/products`), calculée par une vue Map/Reduce sur les logs.
    Un utilisateur sans historique reçoit les produits les plus populaires.
    `[]` s'il n'y a aucune donnée.