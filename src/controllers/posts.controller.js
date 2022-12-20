const PostsService = require('../services/posts.service');
const { InvalidParamsError } = require('../exception/index.exception.js');
const { ValidationError } = require('sequelize');

class PostsController {
    constructor() {
        this.postsService = new PostsService();
    }

    postLookup = async (req, res, next) => {
        try {
            const posts = await this.postsService.findAllPost();
            if (!posts) throw new ValidationError();
            res.status(200).json({ data: posts });
        } catch (error) {
            next(error);
        }
    };

    createPost = async (req, res, next) => {
        try {
            const { title, price, detail, thumbnail } = req.body;
            const { userId } = req.header;
            //const userId = res.locals.user;

            if (!title || !price || !detail) throw new InvalidParamsError();

            const post = await this.postsService.createPost(
                userId,
                title,
                price,
                detail,
                thumbnail
            );

            if (!post) throw new ValidationError();

            res.status(201).json({ postId: post });
        } catch (err) {
            next(err);
        }
    };

    getOnePost = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const post = await this.postsService.getOnePost(postId);

            if (!post) throw new InvalidParamsError();

            res.status(200).json({ data: post });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = PostsController;
