const express = require('express')
const cors = require('cors')
const crud = require('./utils/crud')
const authMiddleware = require('./utils/auth-middleware')

const app = express()

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))
app.use(express.json())

app.get('/api/cart/ping', (req, res) => {
    res.json({message: "opérationnel"})
})

app.get('/api/cart', authMiddleware, async (req, res) => {
    try {
        const data = await crud.getUserData(req.user.username)
        res.json(data.cart)
    } catch (error) {
        res.status(500).json({"status": "error", "message": "Cart not found"})
    }
})


app.get('/api/purchases', authMiddleware, async (req, res) => {
    try {
        const data = await crud.getUserData(req.user.username)
        res.json(data.purchases)
    } catch (error) {
        res.status(500).json({"status": "error", "message": "Order history not found"})
    }
})


app.post('/api/cart', authMiddleware, async (req, res) => {
    try {
        const {productID, quantity } = req.body
        const response = await fetch(`http://products-daemon:80/api/products/${productID}`)
        if (!response.ok) return res.status(404).json({ "status":"error", "message": "Product not found" })
        const product = await response.json()

        const cart = await crud.addToCart(req.user.username, {
            _id: productID,
            name: product.name,
            price: product.price,
            quantity: quantity || 1
        })
        res.json(cart)

    } catch (error) {
        res.status(500).json({"status": "error", "message": "Failed to add to cart"})
    }
})


app.delete('/api/cart/:productID', authMiddleware, async (req, res) => {
    try {
        const cart = await crud.removeFromCart(req.user.username, req.params.productID)
        res.json(cart)
    } catch (error) {
        res.status(500).json({"status": "error", "message": "Failed to remove from cart"})
    }
})


app.post('/api/purchases', authMiddleware, async (req, res) => {
    try {
        const order = await crud.checkout(req.user.username)
        res.status(201).json(order)
    } catch (error) {
        res.status(400).json({"status": "error", "message": "failed to validate order"})
    }
})

module.exports = app