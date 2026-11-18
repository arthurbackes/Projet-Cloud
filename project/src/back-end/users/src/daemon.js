const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const log = require('debug')('users-d')
const app = require('./app')
const db = require('./utils/crud')

const server = express()
server.use(logger('dev'))
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

server.use('/', app)

server.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

server.use((err, req, res, next) => {
  const message = req.app.get('env') === 'development' ? err : {}
  log(`${message}`)
  log(err)
  res.status(err.status || 500)
  res.json({
    status: 'error',
    message: ""
  })
})

const port = process.env.USERS_D_PORT || 80

db.createAdmin()
  .then(() => {
    server.listen(port, function () {
      log(`Listening at port ${port}`)
    })
  })
  .catch((error) => {
    log(error)
  })
