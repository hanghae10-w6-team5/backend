const express = require('express');
const router = express.Router();

const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

router.get('/', postsController.postLookup);
router.post('/', postsController.createPost);
router.get('/:postId', postsController.getOnePost);
router.put('/:postId', postsController.updatePost);
router.delete('/:postId', postsController.deletePost);

module.exports = router;
