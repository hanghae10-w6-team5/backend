const express = require('express');
const router = express.Router();

const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

router.get('/', postsController.postLookup);
router.post('/', postsController.createPost);

module.exports = router;
