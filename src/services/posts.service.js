const PostsRepository = require('../repositories/posts.repository');
const {
    InvalidParamsError,
    ValidationError,
    AuthenticationError,
} = require('../exception/index.exception');

class PostsService {
    constructor() {
        this.postsRepository = new PostsRepository();
    }

    findAllPost = async () => {
        const allPost = await this.postsRepository.findAllPost();

        if (!allPost) throw new ValidationError();

        allPost.sort((a, b) => {
            return b.updatedAt - a.updatedAt;
        });

        return allPost.map((post) => {
            return {
                data: {
                    postId: post.postId,
                    id: post.User.id,
                    title: post.title,
                    price: post.price,
                    thumbnail: post.thumbnail,
                    updatedAt: post.updatedAt,
                },
            };
        });
    };

    createPost = async (userId, title, price, detail, thumbnail) => {
        const data = await this.postsRepository.createPost(
            userId,
            title,
            price,
            detail,
            thumbnail
        );
        //만약 데이터 값이 없으면 null , err 400번을 던짐
        if (!data) throw new ValidationError();
        return data.postId;
    };

    getOnePost = async (postId) => {
        try {
            const post = await this.postsRepository.getOnePost(postId);
            const Comment = await this.postsRepository.getAllComment(postId);
            if (!post)
                throw ValidationError('해당 게시글을 찾을 수 없습니다.', 404);

            let comments = [];
            if (Comment.length !== 0) {
                Comment.forEach((c) => {
                    comments.push({
                        commentId: c.commentId,
                        id: c['User.id'],
                        comment: c.comment,
                        updatedAt: c.updatedAt,
                    });
                });
            }
            return {
                data: {
                    postId: post.postId,
                    id: post.User.id,
                    title: post.title,
                    detail: post.detail,
                    price: post.price,
                    thumbnail: post.thumbnail,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    likes: post.likes.length,
                    comments,
                },
            };
        } catch (error) {
            throw error;
        }
    };
}

module.exports = PostsService;
