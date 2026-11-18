const moment = require('moment')
const jwt = require('jwt-simple')

function encodeToken (user, role) {
  var playload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user,
    role: role
  }
  return jwt.encode(playload, process.env.TOKEN_SECRET)
}


function decodeToken(toke) {
  try {
    const payload = jwt.decode(toke, process.env.TOKEN_SECRET);

    if (!payload.sub || !payload.role) {
      throw new Error('Invalid Token')
    }

    if (!payload.exp || payload.exp <= moment().unix()) {
      throw new Error('Token expired');
    }

    return payload
  } catch(error) {
    const authenticationError = new Error('Invalid Token')
    authenticationError.statusCode = 401;
    throw authenticationError;
  }
}

module.exports = {
  encodeToken,
  decodeToken
}
