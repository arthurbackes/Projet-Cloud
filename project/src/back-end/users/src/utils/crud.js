const bcrypt = require('bcryptjs')
const nano = require('nano')
const tku = require('./en-de-coders')


const couch = nano(process.env.DB_URL) 
const users = couch.db.use(process.env.DB_NAME || 'users')
// const users represents the DB

function equalPassws (usrPass, usrDbPass) {
  return bcrypt.compareSync(usrPass, usrDbPass)
}

function createUser (usrName, passw) {
  const HashOfPassword = bcrypt.hash
}

function getUser (usrName, passw) {
  return new Promise((resolve, reject) => {
    if (users[usrName]) {
      if (!equalPassws(passw, users[usrName].hashedPassw)) {
        reject(new Error(`User (${usrName}) password does not match`))
      }
      resolve(tku.encodeToken(usrName))
    } else {
      reject(new Error(`User (${usrName}) does not exist`))
    }
  })
}

module.exports = {
  createUser,
  getUser
}
