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

            if (!postId) throw new InvalidParamsError();

            res.status(200).json({ data: post });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = PostsController;
