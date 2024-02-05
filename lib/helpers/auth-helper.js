const jwt = require('jsonwebtoken');
const { tokenKey } = require('../../config');


/**
 * 
 * @param {JSON} payload 
 * @returns 
 */
exports.getJWTToken = (payload) => {
    return jwt.sign(payload, tokenKey, {
        expiresIn: '2h',
    });
};