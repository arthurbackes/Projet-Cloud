const express = require('express')
const log = require('debug')('users-d')

const app = express.Router()
const db = require('./utils/crud')

function sendError (res, error) {
  const status = error.statusCode || 500
  return res.status(status).json({ status: 'error', message: error.message })
}

app.post('/user', (req, res) => {
  var usr = req.body.username
  var usrPassw = req.body.password

  if (!usr || !usrPassw) {
    return res.status(400).json({
      status: 'error',
      message: 'Username and password are required !'
    })
  }

  log(`Creating a new user (${usr})"`)
  return db.createUser(usr, usrPassw)
    .then((result) => {
      res.status(201).json({
         status: 'success', 
         token : result.token,
         user : result.user
        })
    })
    .catch((error) => {
      sendError(res, error)
    })
})

app.post('/user/login', (req, res) => {
  var usr = req.body.username
  var passw = req.body.password
  if (!usr || !passw) {
    return res.status(400).json({
      status: 'error',
      message: 'Username and password are required !'
    })
  }

  log(`Getting user (${usr})`)
  return db.getUser(usr, passw)
    .then((result) => {
      res.status(200).json({
         status: 'success', 
         token : result.token,
         user : result.user
        })
    })
    .catch((error) => {
      sendError(res, error)
    })
})

module.exports = app
