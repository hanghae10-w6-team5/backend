const jwt = require('jsonwebtoken');
require('dotenv').config();
const env = process.env;

function createToken(id, duration) {
    return jwt.sign({ userId: id }, env.TOKEN_SECRETE_KEY, {
        expiresIn: duration,
    });
}

function validateToken(token) {
    const { userId } = jwt.verify(token, env.TOKEN_SECRETE_KEY);
    return userId;
}

module.exports = { createToken, validateToken };
