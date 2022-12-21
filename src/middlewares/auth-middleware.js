const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const { AuthenticationError, ValidationError } = require('../exception/index.exception.js');
const env = process.env;

module.exports = (req, res, next) => {
  const authorization = req.get('authorization');

  if (!authorization) {
    throw new AuthenticationError('로그인이 필요한 서비스입니다.', 412);
  }

  try {
    const { userId } = jwt.verify(authToken, env.TOKEN_SECRETE_KEY);
    res.locals.user = userId;
    next();
  } catch (err) {
    throw new AuthenticationError('로그인이 필요한 서비스입니다.', 412);
  }
};
