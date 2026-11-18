const {decodeToken} = require('./en-de-coders')

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({error: 'Missing or invalid Authorisation header'})
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = decodeToken(token)
        req.user = payload
        next()
    } catch(error) {
        const status = error.statusCode || 401
        return res.status(status).json({error: error.message})
    }
}


function requireRole(requiredRole) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({error: 'Authentification required'})
        }
        if (req.user.role !== requiredRole) {
            return res.status(403).json({error: 'Forbidden'})
        }
        next()
    }
}

module.exports = {
    requireAuth, 
    requireRole
}