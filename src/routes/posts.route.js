const express = require('express');
const router = express.Router();

const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

const authMiddleware = require('../middlewares/auth-middleware.js');

router.get('/', postsController.postLookup);
router.post('/', postsController.createPost);
router.get('/:postId', postsController.getOnePost);
router.put('/:postId', authMiddleware, postsController.updatePost);
router.delete('/:postId', authMiddleware, postsController.deletePost);

module.exports = router;
