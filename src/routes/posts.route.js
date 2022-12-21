const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

router.get('/', authMiddleware, postsController.postLookup);
router.post('/', authMiddleware, postsController.createPost);

module.exports = router;
