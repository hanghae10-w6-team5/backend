const PostsRepository = require('../repositories/posts.repository');

class PostsService {
    constructor() {
        this.postsRepository = new PostsRepository();
    }

    getOnePost = async (postId) => {
        try {
            const post = await this.postsRepository.getOnePost(postId);

            res.status(200).json({ data: post });
        } catch (error) {
            throw error;
        }
    };
}

module.exports = PostsService;
