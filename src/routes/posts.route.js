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

module.exports = router;
