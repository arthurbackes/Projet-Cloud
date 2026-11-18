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

    if(typeof product.price !== 'number' || product.price <= 0){
        return res.status(400).json({status:'error', message:'Price should be > 0'})
    }

    return db.createProduct(product)
        .then((createdProduct) => {
        res.status(201).json(createdProduct)
        })
        .catch((err) => {
        res.status( 500).json({ status: 'error', message: String(err) })
        })
})

app.get('/api/products',(req, res) => {
    return db.listProducts()
    .then((list) => {
        res.status(200).json(list)
    })
    .catch((err) => {
        res.status( 500).json({ status: 'error', message: String(err) })
    })  
})

app.get('/api/products/:id',(req, res) => {
    return db.getProduct(req.params.id)
    .then((product) => {
        res.status(200).json(product)
    })
    .catch((err) => {
        res.status( err.statusCode ||500).json({ status: 'error', message: err.message })
    })  
})

app.delete('/api/products/:id',(req,res)=>{
    return db.deleteProduct(req.params.id)
    .then(() => {
        res.sendStatus(204)
    })
    .catch((err) => {
        res.status( err.statusCode ||500).json({ status: 'error', message: err.message })
    }) 
})

app.put('/api/products/:id',(req,res)=>{
    const champs = ['name','price','stock', 'description','category','image']
    const changes = {}
    for (const champ of champs){
        if(req.body[champ] !== undefined){
            if(champ == 'price'){
                if(typeof req.body.price !== 'number' || req.body.price <= 0){
                    return res.status(400).json({status:'error', message:'Price should be > 0'})
                }
            }
            changes[champ] = req.body[champ]
        }
    }
    const len_change = Object.keys(changes).length
    if(len_change === 0){
        return res.status(400).json({status: 'error', message: 'No field to update'})
    }
    
    return db.updateProduct(req.params.id, changes)
    .then((product) => {
        res.status(200).json(product)
    })
    .catch((err) => {
        res.status(err.statusCode ||500).json({ status: 'error', message: err.message })
    })
})

module.exports = app
