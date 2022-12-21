const express = require('express');
const router = express.Router();
const LikesController = require('../controllers/likes.controller');
const likesController = new LikesController();

router.put('/:postId/like', likesController.createPostLike);

module.exports = router;
