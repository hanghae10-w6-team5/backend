const env = process.env;
const { AuthenticationError } = require('../exception/index.exception.js');

module.exports = async (req, res, next) => {
    try {
        const authorization = req.get('authorization');
        if (req.get('authorization')) {
            throw new AuthenticationError('이미 로그인된 사용자입니다.', 400);
        }
        next();
    } catch (err) {
        next(err);
    }
};