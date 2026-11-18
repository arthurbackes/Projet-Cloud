const bcrypt = require('bcryptjs')
const nano = require('nano')
const tku = require('./en-de-coders')

const users = nano(process.env.DB_URL)

function hashPassword (password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (error, passwordHash) => {
      if (error) {
        reject(error)
        return
      }

      resolve(passwordHash)
    })
  })
}

function comparePassword (password, passwordHash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (error, matches) => {
      if (error) {
        reject(error)
        return
      }

      resolve(matches)
    })
  })
}

function insertUser (userDoc) {
  return new Promise((resolve, reject) => {
    users.insert(userDoc, userDoc._id, (error, result) => {
      if (error) {
        reject(error)
        return
      }

      resolve(result)
    })
  })
}

function fetchUser (username) {
  return new Promise((resolve, reject) => {
    users.get(username, (error, userDoc) => {
      if (error) {
        reject(error)
        return
      }

      resolve(userDoc)
    })
  })
}

async function createUser (usrName, passw) {
  const HashOfPassword = await hashPassword(passw)
  const userDoc = {
    _id: usrName,
    type: 'user',
    username: usrName,
    role: 'user',
    psswhash: HashOfPassword
  }
  try {
    await insertUser(userDoc)
    return {
      token: tku.encodeToken(usrName, userDoc.role),
      user : {
        username: usrName,
        role : userDoc.role
      }

    }
  } catch (error) {
    if (error.statusCode === 409 || error.error === 'conflict') {
      const conflictError = new Error(`User ${usrName} already exists`)
      conflictError.statusCode = 409
      throw conflictError
    }

    throw error
  }
}

async function getUser (usrName, passw) {
  try {
    const userDoc = await fetchUser(usrName)
    const passMatch = await comparePassword(passw, userDoc.psswhash)

    if (!passMatch) {
      const authenticationError = new Error('Invalid username or password')
      authenticationError.statusCode = 401
      throw authenticationError
    }
    return {
      token: tku.encodeToken(usrName, userDoc.role),
      user : {
        username: usrName,
        role : userDoc.role
      }
    }
  } catch (error) {
    if (error.statusCode === 404 || error.error === 'not_found') {
      const authenticationError = new Error('Invalid username or password')
      authenticationError.statusCode = 401
      throw authenticationError
    }

    throw error
  }
}

module.exports = {
  createUser,
  getUser
}
