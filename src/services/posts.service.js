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
        // 저장소(Repository)에게 데이터를 요청합니다.
        const allPost = await this.postsRepository.findAllPost();

        if (!allPost) throw new ValidationError();

        // 호출한 Post들을 가장 최신 게시글 부터 정렬합니다.
        allPost.sort((a, b) => {
            return b.updatedAt - a.updatedAt;
        });

        // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
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

            if (userId !== updatePost.userId) {
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
                id: updatePost.id,
                title: updatePost.title,
                detail: updatePost.detail,
                price: updatePost.price,
                thumbnail: updatePost.thumbnail,
                createdAt: updatePost.createdAt,
                updatedAt: updatePost.updatedAt,
                likes: updatePost.likes.length,
            };
        } catch (error) {
            throw error;
        }
    };

    deletePost = async (userId, postId) => {
        const deletePost = await this.postsRepository.deletePost(
            userId,
            postId
        );

        if (deletePost === 0)
            throw new ValidationError('게시글을 삭제하였습니다.', 200);

        if (userId !== updatePost.userId) {
            throw new AuthenticationError('권한이 없는 유저입니다.', 403);
        }

        return deletePost;
    };

    findPost = async (postId) => {
        const existPost = await this.postsRepository.findPost(postId);

        if (!existPost)
            throw new ValidationError('해당 게시글을 찾을 수 없습니다.', 404);

        return existPost;
    };
}

module.exports = PostsService;
