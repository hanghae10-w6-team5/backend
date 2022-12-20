const express = require('express');
const router = express.Router();

const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

router.get('/', postsController.postLookup);
router.get('/:postId', postsController.getOnePost);
router.post('/', postsController.createPost);

module.exports = router;
