const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users.controller');
const usersController = new UsersController();

router.post('/signup', usersController.signUpUser);
router.get('/signup/:id', usersController.signUpDuplicateIdCheck)
router.post('/login', usersController.loginUser);

module.exports = router;
