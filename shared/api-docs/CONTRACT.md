# Contrat d'API - Projet SCApp

Ce document définit les routes de l'API, les formats de requêtes attendus par le serveur et les réponses renvoyées au client.

**Note générale sur l'authentification :**
Toutes les routes (sauf l'inscription, la connexion et la consultation des
produits) nécessitent d'envoyer le jeton JWT dans les en-têtes de la requête :
`Authorization: Bearer <token>`

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

---

## 2. Produits (Catalogue)

### Récupérer tous les produits
*   **Route :** `GET /api/products`
*   **Body attendu :** Aucun
*   **Réponse Succès (`200 OK`) :**
    ```json
    [
      { "id": "p1", "name": "Laptop Dell", "price": 1200, "stock": 5 },
      { "id": "p2", "name": "Souris sans fil", "price": 25, "stock": 12 }
    ]
    ```

### Récupérer un produit spécifique
*   **Route :** `GET /api/products/:id` (ex: `/api/products/p1`)
*   **Body attendu :** Aucun
*   **Réponse Succès (`200 OK`) :**
    ```json
    { "id": "p1", "name": "Laptop Dell", "price": 1200, "stock": 5 }
    ```
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
        { "productId": "p1", "name": "Laptop Dell", "quantity": 1, "price": 1200 }
      ],
      "total": 1200
    }
    ```

### Ajouter / Modifier un produit dans le panier
*   **Route :** `POST /api/cart`
*   **Body attendu :**
    ```json
    {
      "productId": "p2",
      "quantity": 2
    }
    ```
*   **Réponse Succès (`200 OK`) :** Retourne le panier mis à jour (même format que `GET /api/cart`).
*   **Erreurs possibles :**
    *   `401 Unauthorized` : Token manquant ou invalide.
    *   `404 Not Found` : Produit inexistant.
    *   `400 Bad Request` : Stock insuffisant.

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
          { "productId": "p1", "quantity": 1, "price": 1200 }
        ]
      }
    ]
    ```

---

## 5. Logs

### Enregistrer une action front-end
*   **Route :** `POST /api/logs`
*   **Body attendu :**
    ```json
    {
      "action": "page_view",
      "target": "product_p1",
      "timestamp": "2026-11-09T10:05:00Z"
    }
    ```
*   **Réponse Succès (`201 Created`) :**
    ```json
    { "status": "logged" }
    ```