const bcrypt = require('bcryptjs')
const nano = require('nano')
const tku = require('./en-de-coders')


const couch = nano(process.env.DB_URL) 
const users = couch.db.use(process.env.DB_NAME || 'users')

async function createUser (usrName, passw) {
  const HashOfPassword = await bcrypt.hash(passw, 10) // 10 = cout de hachage
  const userDoc = {
    _id: usrName,
    type: 'user',
    username: usrName,
    role: 'user',
    psswhash: HashOfPassword
  }
  try {
    await users.insert(userDoc)
    return tku.encodeToken(usrName)
  } catch(error) {
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
    const userDoc = await users.get(usrName)
    const passMatch = await bcrypt.compare(passw, userDoc.psswhash)

    if (!passMatch) {
      const authenticationError = new Error('Invalid username or password')
      authenticationError.statusCode = 401
      throw authenticationError
    }
    return tku.encodeToken(usrName)
  } catch(error) {
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
