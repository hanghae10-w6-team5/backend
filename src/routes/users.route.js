const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users.controller');
const usersController = new UsersController();
const authTokenChecker = require('../middlewares/auth-token-checker.middleware');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/signup', usersController.signUpUser);
router.get('/signup/:id', usersController.signUpDuplicateIdCheck);
router.post('/login', authTokenChecker, usersController.loginUser);
router.get('/', authMiddleware, usersController.getUserDetail);

module.exports = router;
