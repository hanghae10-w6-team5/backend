const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const {
    AuthenticationError,
    ValidationError,
} = require('../exception/index.exception.js');
const env = process.env;

module.exports = (req, res, next) => {
    const authentication = req.get('authentication');

    if (!authentication) {
        throw new AuthenticationError('로그인이 필요한 서비스입니다.', 412);
    }

    try {
        const { userId } = jwt.verify(authentication, env.TOKEN_SECRETE_KEY);
        console.log(userId);
        res.locals.user = userId;
        next();
    } catch (err) {
        next(err);
    }
};
