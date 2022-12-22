const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

router.get('/', postsController.postLookup);
router.post('/', authMiddleware, postsController.createPost);
router.get('/:postId', postsController.getOnePost);
router.put('/:postId', authMiddleware, postsController.updatePost);
router.delete('/:postId', authMiddleware, postsController.deletePost);

module.exports = router;
