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
*   **Body attendu :** Aucun (le serveur identifie l'utilisateur via le token)
*   **Réponse Succès (`200 OK`) :**
    ```json
    {
      "items": [
        { "productId": "p1", "name": "Laptop Dell", "image": "https://.../p1.jpg", "quantity": 1, "price": 1200 }
      ],
      "total": 1200
    }
    ```
    Panier vide : `{ "items": [], "total": 0 }` (pas de `404`).

### Ajouter / Modifier un produit dans le panier
*   **Route :** `POST /api/cart`
*   **Body attendu :**
    ```json
    {
      "productId": "p2",
      "quantity": 2
    }
    ```
    `quantity` **remplace** la quantité actuelle de ce produit dans le panier
    (si le produit n'y est pas encore, il est ajouté).
*   **Réponse Succès (`200 OK`) :** Retourne le panier mis à jour (même format que `GET /api/cart`).
*   **Erreurs possibles :**
    *   `401 Unauthorized` : Token manquant ou invalide.
    *   `404 Not Found` : Produit inexistant.
    *   `400 Bad Request` : Stock insuffisant ou quantité inférieure à 1.

### Retirer un produit du panier
*   **Route :** `DELETE /api/cart/:productId`
*   **Réponse Succès (`200 OK`) :** le panier mis à jour.
*   **Erreurs possibles :**
    *   `404 Not Found` : Produit absent du panier.

---

## 4. Achats (Purchases)

### Valider le panier et créer une commande
*   **Route :** `POST /api/purchases`
*   **Body attendu :** Aucun (le serveur vide le panier actuel et crée la commande)
*   **Réponse Succès (`201 Created`) :**
    ```json
    {
      "orderId": "o1",
      "date": "2026-11-09T10:00:00Z",
      "total": 1200,
      "status": "confirmed"
    }
    ```
*   **Erreurs possibles :**
    *   `400 Bad Request` : Panier vide.
*   **Notes :**
    *   Le prix de chaque article est figé au moment de l'achat.
    *   En cas d'erreur, le panier n'est pas vidé.
    *   Double validation : le panier étant vide après la première, la
        seconde renvoie `400` et ne crée pas de deuxième commande.

### Historique des achats
*   **Route :** `GET /api/purchases`
*   **Body attendu :** Aucun
*   **Réponse Succès (`200 OK`) :**
    ```json
    [
      {
        "orderId": "o1",
        "date": "2026-11-09T10:00:00Z",
        "total": 1200,
        "items": [
          { "productId": "p1", "name": "Laptop Dell", "image": "https://.../p1.jpg", "quantity": 1, "price": 1200 }
        ]
      }
    ]
    ```
    Trié du plus récent au plus ancien, `[]` si aucun achat.

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