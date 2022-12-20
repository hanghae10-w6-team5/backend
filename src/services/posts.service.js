const PostsRepository = require('../repositories/posts.repository');
const { ValidationError } = require('../exception/index.exception.js');
class PostsService {
    constructor() {
        this.postsRepository = new PostsRepository();
    }

    getOnePost = async (postId) => {
        try {
            const post = await this.postsRepository.getOnePost(postId);
            const Comment = await this.postsRepository.getAllComment(postId);
            if (!post)
                throw new ValidationError(
                    '해당 게시글을 찾을 수 없습니다.',
                    404
                );

            let comments = [];
            if (Comment.length) {
                Comment.map((c) => {
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
                    id: post.id,
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

    updatePost = async (userId, postId, title, detail, price, thumbnail) => {
        try {
            const post = await this.postsRepository.updatePost(
                userId,
                postId,
                title,
                detail,
                price,
                thumbnail
            );
            if (!post)
                throw new ValidationError(
                    '해당 게시글을 찾을 수 없습니다.',
                    404
                );
        } catch (error) {
            throw error;
        }

        getOnePost = async (postId) => {
            try {
                const post = await this.postsRepository.getOnePost(postId);
                const Comment = await this.postsRepository.getAllComment(
                    postId
                );
                if (!post)
                    throw ValidationError(
                        '해당 게시글을 찾을 수 없습니다.',
                        404
                    );

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
                        id: post.id,
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
    };
}

module.exports = PostsService;
