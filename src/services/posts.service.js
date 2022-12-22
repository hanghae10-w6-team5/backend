const PostsRepository = require('../repositories/posts.repository');
const {
    ValidationError,
    AuthenticationError,
} = require('../exception/index.exception');
const jwt = require('jsonwebtoken');
const env = process.env;
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
                    updatedAt: post.updatedAt.toLocaleString('ko-KR', {
                        timeZone: 'UTC',
                    }),
                    likes: post.likes.length,
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

            if (!post)
                throw new ValidationError(
                    '해당 게시글을 찾을 수 없습니다.',
                    404
                );

            let comments = [];
            if (post.Comments) {
                post.Comments.map((c) => {
                    comments.push({
                        commentId: c.commentId,
                        id: c.User.id,
                        comment: c.comment,
                        updatedAt: c.updatedAt.toLocaleString('ko-KR', {
                            timeZone: 'UTC',
                        }),
                    });
                });
            }

            return {
                postId: post.postId,
                userId: post.userId,
                id: post.User.id,
                title: post.title,
                detail: post.detail,
                price: post.price,
                thumbnail: post.thumbnail,
                createdAt: post.createdAt.toLocaleString('ko-KR', {
                    timeZone: 'UTC',
                }),
                updatedAt: post.updatedAt.toLocaleString('ko-KR', {
                    timeZone: 'UTC',
                }),
                likes: post.likes.length,
                comments,
            };
        } catch (error) {
            throw error;
        }
    };

    updatePost = async (userId, postId, title, detail, price, thumbnail) => {
        try {
            const post = await this.postsRepository.getOnePost(postId);

            if (!post)
                throw new ValidationError(
                    '해당 게시글을 찾을 수 없습니다.',
                    404
                );

            if (userId !== post.userId) {
                throw new AuthenticationError('권한이 없는 유저입니다.', 403);
            }

            await this.postsRepository.updatePost(
                userId,
                postId,
                title,
                detail,
                price,
                thumbnail
            );
            const updatePost = await this.postsRepository.getOnePost(postId);

            return {
                postId: updatePost.postId,
                id: updatePost.User.id,
                title: updatePost.title,
                detail: updatePost.detail,
                price: updatePost.price,
                thumbnail: updatePost.thumbnail,
                createdAt: updatePost.createdAt.toLocaleString('ko-KR', {
                    timeZone: 'UTC',
                }),
                updatedAt: updatePost.updatedAt.toLocaleString('ko-KR', {
                    timeZone: 'UTC',
                }),
                likes: updatePost.likes.length,
            };
        } catch (error) {
            throw error;
        }
    };

    deletePost = async (userId, postId) => {
        const existPost = await this.postsRepository.findPost(postId);
        if (!existPost)
            throw new ValidationError('해당 게시글을 찾을 수 없습니다.', 404);

        if (userId !== existPost.userId) {
            throw new AuthenticationError('권한이 없는 유저입니다.', 403);
        }

        await this.postsRepository.deletePost(userId, postId);
    };
}

module.exports = PostsService;
