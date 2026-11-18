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

app.get('api/cart/ping', (req, res) => {
    res.json({message: "opérationnel"})
})


module.exports = app