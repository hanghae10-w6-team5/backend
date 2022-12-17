const { Posts } = require('../models');
const { InvalidParamsError } = require('../exception/index.exception');
class PostsRepository extends Posts {
    constructor() {
        super();
    }

    getOnePost = async (postId) => {
        const post = await Posts.findByPk(postId);
        if (!post)
            throw new InvalidParamsError(
                '해당 게시글을 찾을 수 없습니다.',
                404
            );
        res.status(200).json({ data: post });
    };
}
module.exports = PostsRepository;
