const express = require('express');
const router = express.Router();

const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

router.get('/:postId', postsController.getOnePost);

module.exports = router;
