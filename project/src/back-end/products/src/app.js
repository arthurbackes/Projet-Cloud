const express = require('express')
const log = require('debug')('products-d')

const app = express.Router()
const db = require('./utils/crud')

app.post('/api/products', (req, res) => {
    var product = {
        name : req.body.name,
        price : req.body.price,
        stock : req.body.stock,
        description : req.body.description,
        category : req.body.category,
        image : req.body.image
    }

    if(!product.name || !product.price || !product.category || product.stock === undefined){
        return res.status(400).json({ status : 'error', message : 'Name, price, category and stock are required'})
    }

    return db.createProduct(product)
        .then((createdProduct) => {
        res.status(201).json(createdProduct)
        })
        .catch((err) => {
        res.status(500).json({ status: 'error', message: String(err) })
        })
})

app.get('/api/products',(req, res) => {
    return db.listProducts()
    .then((list) => {
        res.status(200).json(list)
    })
    .catch((err) => {
        res.status(500).json({ status: 'error', message: String(err) })
    })  
})

module.exports = app
