const PostsService = require('../services/posts.service');
const { InvalidParamsError } = require('../exception/index.exception.js');
class PostsController {
    constructor() {
        this.postsService = new PostsService();
    }

    getOnePost = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const post = await this.postsService.getOnePost(postId);

            if (!post)
                throw new InvalidParamsError(
                    '해당 게시글을 찾을 수 없습니다.',
                    404
                );

            res.status(200).json({ data: post });
        } catch (error) {
            next(error);
        }
    };

    updatePost = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { title, detail, price, thumbnail } = req.body;
            const userId = res.locals.user;

            if (!title || !detail) {
                throw new InvalidParamsError(
                    '해당 게시글을 찾을 수 없습니다.',
                    404
                );
            }

            const post = await this.postsService.updatePost(
                postId,
                userId,
                title,
                detail,
                price,
                thumbnail
            );

            res.status(200).json({ data: post });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = PostsController;
