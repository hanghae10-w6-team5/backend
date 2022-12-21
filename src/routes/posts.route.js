const express = require('express');
const router = express.Router();
const { Posts } = require('../models');

router.post('/', async (req, res) => {
    const { title, detail, price, thumbnail } = req.body;
    const createPost = await Posts.create({
        userId: 1,
        title,
        detail,
        price,
        thumbnail,
    });
    res.status(200).json({ data: createPost });
});

router.patch('/:postId', async (req, res) => {
    const { postId } = req.params;
    const { title, detail, price, thumbnail } = req.body;
    const updatePost = await Posts.update(
        {
            title,
            detail,
            price,
            thumbnail,
        },
        {
            where: { postId },
        }
    );
    console.log(updatePost);
    const post = await Posts.findOne({ where: { postId } });
    res.status(200).json({ data: post });
});

const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

const authMiddleware = require('../middlewares/auth-middleware.js');

router.get('/', postsController.postLookup);
router.post('/', authMiddleware, postsController.createPost);
router.get('/:postId', postsController.getOnePost);
router.put('/:postId', authMiddleware, postsController.updatePost);
router.delete('/:postId', authMiddleware, postsController.deletePost);

module.exports = router;
