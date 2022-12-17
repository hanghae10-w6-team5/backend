const PostsService = require('../services/posts.service');

class PostsController {
    constructor() {
        this.postsService = new PostsService();
    }

    getOnePost = async (req, res, next) => {
        try {
            const { postId } = req.params;
            const post = await this.postsService.getOnePost(postId);

            res.status(200).json({ data: post });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = PostsController;
