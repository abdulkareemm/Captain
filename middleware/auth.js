const jwt = require('jsonwebtoken');
const { tokenKey } = require('../config');

/**
 * Verify JWT middleware
 */
exports.verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(!token)
        return res.status(403).send("Invalid request! Token is required.");
    try {
        const decoded = jwt.verify(token, tokenKey);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid token.");
    }
    return next();
};

/**
 * 
 */
exports.isAdmin = (req, res, next) => {
    if(req.user.role === 'admin')
        return next();
    else 
        return res.status(401).json({
            error: "Unauthorized."
        });
};